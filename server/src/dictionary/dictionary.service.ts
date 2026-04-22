import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
    ContractTypesResp,
    EventTypesResp,
    WeekDaysResp,
} from './dictionary.dto';

@Injectable()
export class DictionaryService {
    constructor(private prisma: PrismaService) {}

    public async getWeekdays() {
        let weekdays = await this.prisma.weekDay.findMany();

        if (weekdays.length === 0) {
            await this._initWeekDays();
        }

        weekdays = await this.prisma.weekDay.findMany();

        return weekdays;
    }

    public async getContractTypes() {
        let contractTypes = await this.prisma.contractType.findMany();

        if (contractTypes.length === 0) {
            await this._initContractTypes();
        }

        contractTypes = await this.prisma.contractType.findMany();

        return contractTypes;
    }

    public async getEventTypes() {
        let eventTypes = await this.prisma.eventType.findMany();

        if (eventTypes.length === 0) {
            await this._initEventTypes();
        }

        eventTypes = await this.prisma.eventType.findMany();

        return eventTypes;
    }

    private async _initWeekDays() {
        const weekDays = [
            {
                id: 0,
                fullname: 'Понедельник',
                isWeekend: false,
                number: 0,
                shortname: 'Пн',
            },
            {
                id: 1,
                fullname: 'Вторник',
                isWeekend: false,
                number: 1,
                shortname: 'Вт',
            },
            {
                id: 2,
                fullname: 'Среда',
                isWeekend: false,
                number: 2,
                shortname: 'Ср',
            },
            {
                id: 3,
                fullname: 'Четверг',
                isWeekend: false,
                number: 3,
                shortname: 'Чт',
            },
            {
                id: 4,
                fullname: 'Пятница',
                isWeekend: false,
                number: 4,
                shortname: 'Пт',
            },
            {
                id: 5,
                fullname: 'Суббота',
                isWeekend: true,
                number: 5,
                shortname: 'Сб',
            },
            {
                id: 6,
                fullname: 'Воскресенье',
                isWeekend: true,
                number: 6,
                shortname: 'Вс',
            },
        ] as WeekDaysResp[];

        return this.prisma.weekDay.createMany({
            data: weekDays,
        });
    }

    private async _initContractTypes() {
        const contractTypes = [
            {
                id: 1,
                name: '5/2',
                type: 'custom_days',
            },
            {
                id: 2,
                name: '2/2',
                type: 'cycle',
            },
        ] as ContractTypesResp[];

        return this.prisma.contractType.createMany({
            data: contractTypes,
        });
    }

    private async _initEventTypes() {
        const eventTypes = [
            {
                id: 2,
                name: 'Больничный',
                color: '#F4F6FD',
            },
            {
                id: 1,
                name: 'Выходной',
                color: '#FCFCFC',
            },
            {
                id: 4,
                name: 'Отпуск',
                color: '#F8F2FF',
            },
            {
                id: 5,
                name: 'Рабочий день',
                color: '#E6FFE6',
            },
            {
                id: 3,
                name: 'Форс-мажор',
                color: '#FAE7F7',
            },
        ] as EventTypesResp[];

        return this.prisma.eventType.createMany({
            data: eventTypes,
        });
    }
}
