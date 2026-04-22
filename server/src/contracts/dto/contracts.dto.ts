import { IsDateString, IsNumber, IsString } from 'class-validator';

export class ContractDto {
    @IsString()
    name: string;

    shift: ShiftDto;
}

export class ShiftDto {
    @IsNumber()
    duration: number;

    @IsNumber()
    id: number;

    @IsDateString()
    startDate: string;

    @IsDateString()
    startTime: string;

    customDays: CustomDaysDto[];
}

export class CustomDaysDto {
    @IsString()
    type: string;

    @IsNumber()
    weeknumber: number;
}

export class ContractAssignDto {
    employee: ContractAssignEmployeeDto;
}

export class ContractAssignEmployeeDto {
    @IsString()
    fullname: string;

    @IsNumber()
    id: number;
}
