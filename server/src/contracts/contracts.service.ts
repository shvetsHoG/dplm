import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthDto } from '../dto/auth.dto';
import { ContractAssignDto, ContractDto, ShiftDto } from './dto/contracts.dto';
import { ShiftType, WeekdayType } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import {
    ContractResponseDto,
    EmployeeGroupsEmployeeResponseDto,
} from './dto/contracts-response.dto';

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

        const data = this._getCreateUpdateShift(contractType, shift);

        return this.prisma.contract.create({
            data: {
                name,
                shift: {
                    create: data,
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

    public async assignEmployeeToContract(
        contractId: number,
        dto: ContractAssignDto,
    ) {
        const { employee } = dto;

        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
            include: {
                employeeGroups: {
                    include: {
                        employees: true,
                    },
                },
            },
        });

        if (!contract) {
            throw new NotFoundException(
                `Contract with ID ${contractId} not found`,
            );
        }

        const existingEmployee = await this.prisma.employee.findUnique({
            where: { id: employee.id },
            include: {
                employeeGroup: {
                    include: {
                        contract: true,
                    },
                },
            },
        });

        if (existingEmployee) {
            if (existingEmployee.employeeGroup?.contractId) {
                throw new ConflictException(
                    `Employee ${employee.fullname} (ID: ${employee.id}) is already assigned to contract ID: ${existingEmployee.employeeGroup.contractId}`,
                );
            }

            return this._updateExistingEmployee(contractId, existingEmployee);
        }

        return this._createNewEmployeeInContract(contractId, employee);
    }

    public async unassignEmployeeFromContract(
        contractId: number,
        employeeId: string,
    ) {
        return this.prisma.$transaction(async prisma => {
            const contract = await prisma.contract.findUnique({
                where: { id: contractId },
                include: {
                    employeeGroups: {
                        include: {
                            employees: true,
                        },
                    },
                },
            });

            console.log(contract);

            if (!contract) {
                throw new NotFoundException(
                    `Contract with ID ${contractId} not found`,
                );
            }

            const employee = await prisma.employee.findUnique({
                where: { id: employeeId },
                include: {
                    employeeGroup: {
                        include: {
                            contract: true,
                        },
                    },
                },
            });

            if (!employee) {
                throw new NotFoundException(
                    `Employee with ID ${employeeId} not found`,
                );
            }

            if (
                !employee.employeeGroup ||
                employee.employeeGroup.contractId !== contractId
            ) {
                throw new BadRequestException(
                    `Employee ${employee.fullname} (ID: ${employeeId}) is not assigned to contract ${contract.name} (ID: ${contractId})`,
                );
            }

            await prisma.employee.delete({
                where: { id: employeeId },
            });

            return {
                success: true,
                message: `Employee ${employee.fullname} successfully unassigned from contract ${contract.name}`,
                data: {
                    employee: {
                        id: employee.id,
                        fullname: employee.fullname,
                    },
                    contract: {
                        id: contract.id,
                        name: contract.name,
                    },
                },
            };
        });
    }

    public async updateContract(id: number, dto: ContractDto) {
        const { name, shift } = dto;

        const existingContract = await this.prisma.contract.findUnique({
            where: { id },
            include: { shift: true },
        });

        if (!existingContract) {
            throw new NotFoundException(`Contract with id ${id} not found`);
        }

        return this.prisma.$transaction(async prisma => {
            await prisma.contract.update({
                where: { id },
                data: {
                    name: name || existingContract.name,
                },
            });

            if (shift) {
                const contractType =
                    shift.id === 1 ? ShiftType.custom_days : ShiftType.cycle;

                if (existingContract.shift) {
                    const data = this._getCreateUpdateShift(
                        contractType,
                        shift,
                    );

                    await prisma.customDay.deleteMany({
                        where: { shiftId: existingContract.shift.id },
                    });

                    await prisma.shift.update({
                        where: { id: existingContract.shift.id },
                        data,
                    });
                } else {
                    const data = this._getCreateUpdateShift(
                        contractType,
                        shift,
                        id,
                    );

                    await prisma.shift.create({
                        data,
                    });
                }
            }

            return prisma.contract.findUnique({
                where: { id },
                include: {
                    shift: {
                        include: {
                            customDays: true,
                        },
                    },
                },
            });
        });
    }

    public async getEmployee(id: string) {
        const employee = await this.prisma.employee.findUnique({
            where: { id },
        });

        return plainToClass(EmployeeGroupsEmployeeResponseDto, employee, {
            excludeExtraneousValues: true,
        });
    }

    private async _updateExistingEmployee(contractId: number, employee: any) {
        const employeeGroup = await this._getOrCreateEmployeeGroup(contractId);

        const updatedEmployee = await this.prisma.employee.update({
            where: { id: employee.id },
            data: {
                employeeGroupId: employeeGroup.id,
            },
            include: {
                employeeGroup: {
                    include: {
                        contract: true,
                    },
                },
            },
        });

        return {
            success: true,
            message: 'Employee assigned to contract successfully',
            employee: {
                id: updatedEmployee.id,
                fullname: updatedEmployee.fullname,
                contractId: updatedEmployee.employeeGroup.contractId,
                employeeGroupId: updatedEmployee.employeeGroupId,
            },
        };
    }

    private async _createNewEmployeeInContract(
        contractId: number,
        employee: { id: string; fullname: string },
    ) {
        const employeeGroup = await this._getOrCreateEmployeeGroup(contractId);

        const newEmployee = await this.prisma.employee.create({
            data: {
                id: employee.id,
                fullname: employee.fullname,
                employeeGroupId: employeeGroup.id,
            },
            include: {
                employeeGroup: {
                    include: {
                        contract: true,
                    },
                },
            },
        });

        return {
            success: true,
            message: 'Employee created and assigned to contract successfully',
            employee: {
                id: newEmployee.id,
                fullname: newEmployee.fullname,
            },
        };
    }

    private async _getOrCreateEmployeeGroup(contractId: number) {
        let employeeGroup = await this.prisma.employeeGroup.findFirst({
            where: { contractId },
        });

        if (!employeeGroup) {
            employeeGroup = await this.prisma.employeeGroup.create({
                data: {
                    externalId: contractId,
                    name: `Contract Group ${contractId}`,
                    contractId: contractId,
                },
            });
        }

        return employeeGroup;
    }

    private _getCreateUpdateShift(
        contractType: 'custom_days' | 'cycle',
        shift: ShiftDto,
        contractId?: number,
    ) {
        return {
            duration: shift.duration,
            startDate: new Date(shift.startDate),
            startTime: new Date(shift.startTime),
            type: contractType,
            contractId,
            customDays: {
                create: shift.customDays?.map(customDay => ({
                    type:
                        customDay.type === 'weekend'
                            ? WeekdayType.weekend
                            : WeekdayType.workday,
                    weeknumber: customDay.weeknumber,
                })),
            },
        };
    }
}
