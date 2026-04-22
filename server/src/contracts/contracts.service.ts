import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthDto } from '../dto/auth.dto';
import { ContractDto } from './dto/contracts.dto';
import { ShiftType, WeekdayType } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { ContractResponseDto } from './dto/contracts-rexponse.dto';

@Injectable()
export class ContractsService {
    constructor(private prisma: PrismaService) {}

    public async getContracts() {
        const contracts = await this.prisma.contract.findMany({
            select: {
                id: true,
                name: true,
                shift: {
                    select: {
                        type: true,
                    },
                },
                employeeGroups: {
                    select: {
                        employees: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });

        const transformedContracts = contracts.map(contract => ({
            id: contract.id,
            name: contract.name,
            shift_name: contract.shift?.type === 'cycle' ? '2/2' : '5/2',
            employee_count: contract.employeeGroups.reduce(
                (total, group) => total + group.employees.length,
                0,
            ),
        }));

        return {
            contracts: transformedContracts,
            total_count: transformedContracts.length,
        };
    }

    public async createContract(dto: ContractDto) {
        const { name, shift } = dto;

        const contractType =
            shift.id === 1 ? ShiftType.custom_days : ShiftType.cycle;

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
                            create: shift.customDays?.map(customDay => ({
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
            throw new NotFoundException(`Contract with ID ${id} not found`);
            return null;
        }

        return plainToClass(ContractResponseDto, contract, {
            excludeExtraneousValues: true,
        });
    }

    public async deleteContract(id: number) {
        const contract = await this.getContractById(id);

        if (contract) {
            return this.prisma.contract.delete({
                where: { id },
            });
        }
    }
}
