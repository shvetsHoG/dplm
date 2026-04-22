import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthDto } from '../dto/auth.dto';
import { hash } from 'argon2';
import { ContractDto } from './dto/contracts.dto';
import { ShiftType, WeekdayType } from '@prisma/client';

@Injectable()
export class ContractsService {
    constructor(private prisma: PrismaService) {}

    public createContract(dto: ContractDto) {
        try {
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
        } catch (e) {
            console.log(e);
        }
    }

    public async getUserById(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    public async getUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    public async createUser(dto: AuthDto) {
        const user = {
            email: dto.email,
            name: '',
            password: await hash(dto.password),
        };

        return this.prisma.user.create({
            data: user,
        });
    }

    public async updateUser(id: string, dto: AuthDto) {
        let data = dto;

        if (dto.password) {
            data = { ...dto, password: await hash(dto.password) };
        }

        return this.prisma.user.update({
            where: {
                id,
            },
            data,
            select: {
                name: true,
                email: true,
            },
        });
    }

    public async getProfile(id: string) {
        const profile = await this.getUserById(id);

        const { password, ...rest } = profile;

        return {
            user: rest,
        };
    }
}
