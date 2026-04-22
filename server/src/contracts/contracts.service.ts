import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthDto } from '../dto/auth.dto';
import { hash } from 'argon2';
import { ContractDto } from './dto/contracts.dto';
import { ShiftType, WeekdayType } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { ContractResponseDto } from './dto/contracts-rexponse.dto';

@Injectable()
export class ContractsService {
    constructor(private prisma: PrismaService) {}

    public createContract(dto: ContractDto) {
        const { name, shift } = dto;

        const contractType = shift.customDays
            ? ShiftType.custom_days
            : ShiftType.cycle;

        return this.prisma.contract.create({
            data: {
                name,
                shift: {
                    create: {
                        duration: shift.duration,
                        startDate: new Date(shift.startDate),
                        startTime: new Date(shift.startTime),
                        type: contractType,
                        customDays: {
                            create: shift.customDays.map(customDay => ({
                                type:
                                    customDay.type === 'weekend'
                                        ? WeekdayType.weekend
                                        : WeekdayType.workday,
                                weeknumber: customDay.weeknumber,
                            })),
                        },
                    },
                },
            },
        });
    }

    public async getContractById(id: number) {
        const contract = await this.prisma.contract.findUnique({
            where: { id },
            include: {
                employeeGroups: {
                    include: {
                        employees: true,
                    },
                },
                shift: {
                    include: {
                        customDays: true,
                    },
                },
            },
        });

        if (!contract) {
            throw new Error(`Contract with id ${id} not found`);
        }

        return plainToClass(ContractResponseDto, contract, {
            excludeExtraneousValues: true,
        });
    }
}
