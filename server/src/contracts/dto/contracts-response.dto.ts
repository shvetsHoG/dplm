import { Exclude, Expose, Type } from 'class-transformer';

export class CustomDayResponseDto {
    @Exclude()
    id: number;

    @Expose()
    type: string;

    @Expose()
    weeknumber: number;

    @Exclude()
    shiftId: number;
}

export class ShiftResponseDto {
    @Expose()
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
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    @Type(() => ShiftResponseDto)
    shift: ShiftResponseDto;

    @Expose()
    @Type(() => EmployeeGroupsResponseDto)
    employeeGroups: EmployeeGroupsResponseDto[];
}

export class EmployeeGroupsResponseDto {
    @Expose()
    id: number;

    @Exclude()
    externalId: number;

    @Expose()
    name: string;

    @Expose()
    @Type(() => EmployeeGroupsEmployeeResponseDto)
    employees: EmployeeGroupsEmployeeResponseDto[];

    @Exclude()
    contractId: number;
}

export class EmployeeGroupsEmployeeResponseDto {
    @Expose()
    id: number;

    @Expose()
    fullname: string;

    @Exclude()
    employeeGroupId: number;
}
