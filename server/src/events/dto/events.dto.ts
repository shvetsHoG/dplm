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
