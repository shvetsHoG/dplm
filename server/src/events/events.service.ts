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
import { filter } from 'rxjs';

@Injectable()
export class EventsService {
    constructor(
        private prisma: PrismaService,
        private _contractsService: ContractsService,
    ) {}

    public async createEvent(employeeId: string, dto: EventsCreateDto) {
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

    public async deleteEvent(employeeId: string, eventId: number) {
        const event = await this._getEmployeeEvent(employeeId, eventId);

        if (!event) {
            throw new NotFoundException(`Event not found`);
        }

        return this.prisma.event.delete({
            where: { id: eventId, employeeId },
        });
    }

    public async changeEvent(
        employeeId: string,
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

        const ids: string[] = employeeIds?.split(',');
        const start = new Date(startDate);
        const end = new Date(endDate);

        const userIds = ids ?? (await this._getUsersIds()).map(i => i.id);

        const items = await Promise.all(
            userIds.map(async id => {
                const employee = await this._contractsService.getEmployee(id);

                if (!employee) {
                    return null;
                }

                const events = await this._getAllEmployeeEventsInDate(
                    id,
                    start,
                    end,
                    +limit,
                    +offset,
                );

                const employeeGroup =
                    await this.prisma.employeeGroup.findUnique({
                        where: { id: employee?.employeeGroupId },
                    });

                const rawContract = await this.prisma.contract.findUnique({
                    where: {
                        id: employeeGroup.contractId,
                    },
                    include: {
                        shift: {
                            include: {
                                customDays: true,
                            },
                        },
                    },
                });

                const { contractId, ...restShift } = rawContract.shift;

                const contract = {
                    startDt: rawContract.createdAt,
                    endDt: null,
                    shift: restShift,
                };

                return { employee, events, contract };
            }),
        );

        return {
            items: items.filter(Boolean),
            totalCount: items.filter(Boolean).length > 0 ? userIds.length : 0,
        };
    }

    private async _findConflictingEvent(
        employeeId: string,
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

    private async _getEmployeeEvent(employeeId: string, eventId: number) {
        return this.prisma.event.findUnique({
            where: { id: eventId, employeeId },
        });
    }

    private async _getAllEmployeeEventsInDate(
        employeeId: string,
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

    private async _getUsersIds() {
        return this.prisma.user.findMany({
            select: {
                id: true,
            },
        });
    }
}
