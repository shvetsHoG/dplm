import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EventsCreateDto } from './dto/events.dto';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) {}

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
}
