import { Exclude, Expose, Type } from 'class-transformer';

class CustomDayResponseDto {
    @Exclude()
    id: number;

    @Expose()
    type: string;

    @Expose()
    weeknumber: number;

    @Exclude()
    shiftId: number;
}

class ShiftResponseDto {
    @Exclude()
    id: number;

    @Expose()
    duration: number;

    @Expose()
    startDate: Date;

    @Expose()
    startTime: Date;

    @Expose()
    type: string;

    @Exclude()
    contractId: number;

    @Expose()
    @Type(() => CustomDayResponseDto)
    customDays: CustomDayResponseDto[];
}

export class ContractResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    @Type(() => ShiftResponseDto)
    shift: ShiftResponseDto;

    @Expose()
    employeeGroups: any[];
}
