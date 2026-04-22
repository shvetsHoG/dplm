import { IsDateString, IsNumber, IsString } from 'class-validator';

export class EventsCreateDto {
    @IsString()
    desc: string;

    @IsDateString()
    endDt: string;

    @IsNumber()
    eventTypeId: 1;

    @IsDateString()
    startDt: string;
}

export class QueryCalendarDto {
    limit: string;
    offset: string;
    endDate: string;
    startDate: string;
    employeeIds: string;
}
