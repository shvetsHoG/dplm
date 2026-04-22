import {
    IsDateString,
    IsNumber,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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

export class ContractAssignEmployeeDto {
    @IsString()
    fullname: string;

    @IsString()
    id: string;
}

export class ContractAssignDto {
    @ValidateNested()
    @Type(() => ContractAssignEmployeeDto)
    employee: ContractAssignEmployeeDto;
}
