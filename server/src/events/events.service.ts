import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EventsCreateDto, QueryCalendarDto } from './dto/events.dto';
import { ContractsService } from '../contracts/contracts.service';
import { plainToClass } from 'class-transformer';
import { EventResponseDto } from './dto/events-response.dto';

@Injectable()
export class EventsService {
    constructor(
        private prisma: PrismaService,
        private _contractsService: ContractsService,
    ) {}

    public async createEvent(employeeId: number, dto: EventsCreateDto) {
        const conflictingEvent = await this._findConflictingEvent(
            employeeId,
            dto,
        );

        if (conflictingEvent) {
            throw new ConflictException(
                `Event already exists with same date: ${conflictingEvent.startDt} or ${conflictingEvent.endDt}`,
            );
        }

        return this.prisma.event.create({
            data: {
                desc: dto.desc,
                startDt: new Date(dto.startDt),
                endDt: new Date(dto.endDt),
                eventTypeId: dto.eventTypeId,
                employeeId: employeeId,
            },
            include: {
                type: true,
                employee: true,
            },
        });
    }

    public async deleteEvent(employeeId: number, eventId: number) {
        const event = await this._getEmployeeEvent(employeeId, eventId);

        if (!event) {
            throw new NotFoundException(`Event not found`);
        }

        return this.prisma.event.delete({
            where: { id: eventId, employeeId },
        });
    }

    public async changeEvent(
        employeeId: number,
        eventId: number,
        dto: EventsCreateDto,
    ) {
        const event = await this._getEmployeeEvent(employeeId, eventId);

        if (!event) {
            throw new NotFoundException(`Event not found`);
        }

        return this.prisma.event.update({
            where: { id: eventId, employeeId },
            data: {
                desc: dto.desc,
                startDt: new Date(dto.startDt),
                endDt: new Date(dto.endDt),
                eventTypeId: dto.eventTypeId,
            },
        });
    }

    public async getCalendar(query: QueryCalendarDto) {
        const { limit, offset, employeeIds, startDate, endDate } = query;

        const ids: number[] = employeeIds.split(',').map(id => +id);
        const start = new Date(startDate);
        const end = new Date(endDate);

        const items = await Promise.all(
            ids.map(async id => {
                const employee = await this._contractsService.getEmployee(id);
                const events = await this._getAllEmployeeEventsInDate(
                    id,
                    start,
                    end,
                    +limit,
                    +offset,
                );

                return { employee, events };
            }),
        );

        return items;
    }

    private async _findConflictingEvent(
        employeeId: number,
        dto: EventsCreateDto,
    ) {
        const { startDt, endDt } = dto;

        const employee = await this.prisma.employee.findUnique({
            where: { id: employeeId },
        });

        if (!employee) {
            throw new NotFoundException(
                `Employee with id ${employeeId} not found`,
            );
        }

        return this.prisma.event.findFirst({
            where: {
                employeeId: employeeId,
                OR: [
                    { startDt: new Date(startDt) },
                    { endDt: new Date(endDt) },
                    {
                        AND: [
                            { startDt: { lte: new Date(endDt) } },
                            { endDt: { gte: new Date(startDt) } },
                        ],
                    },
                ],
            },
            include: {
                type: true,
                employee: true,
            },
        });
    }

    private async _getEmployeeEvent(employeeId: number, eventId: number) {
        return this.prisma.event.findUnique({
            where: { id: eventId, employeeId },
        });
    }

    private async _getAllEmployeeEventsInDate(
        employeeId: number,
        start: Date,
        end: Date,
        limit: number,
        offset: number,
    ) {
        const where = {
            employeeId,
            OR: [
                {
                    startDt: {
                        gte: start,
                        lte: end,
                    },
                },
                {
                    endDt: {
                        gte: start,
                        lte: end,
                    },
                },
                {
                    AND: [{ startDt: { lte: start } }, { endDt: { gte: end } }],
                },
            ],
        };

        const events = await this.prisma.event.findMany({
            where,
            include: {
                type: true,
            },
            orderBy: {
                startDt: 'asc',
            },
            skip: offset,
            take: limit,
        });

        return plainToClass(EventResponseDto, events, {
            excludeExtraneousValues: true,
        });
    }
}
