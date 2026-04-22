import { Exclude, Expose } from 'class-transformer';

export class EventResponseDto {
    @Expose()
    id: number;

    @Expose()
    desc: string;

    @Expose()
    startDt: Date;

    @Expose()
    endDt: Date;

    @Expose()
    type: {
        id: number;
        name: string;
        color: string;
    };

    @Exclude()
    eventTypeId: number;

    @Exclude()
    employeeId: number;
}
