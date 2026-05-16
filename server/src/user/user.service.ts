import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from '../dto/auth.dto';
import { hash } from 'argon2';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    public async getUsers() {
        const users = await this.prisma.user.findMany();

        return users.map(user => {
            const { password, ...rest } = user;
            return rest;
        });
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

    public async createUser(dto: RegisterDto) {
        const user = {
            email: dto.email,
            name: dto.name,
            password: await hash(dto.password),
        };

        return this.prisma.user.create({
            data: user,
        });
    }

    public async updateUser(id: string, dto: UserDto) {
        let data = dto;

        if (dto.password) {
            data = { ...dto, password: await hash(dto.password) };
        }

        return this.prisma.user.update({
            where: {
                id,
            },
            data: { ...data, updatedAt: new Date() },
            select: {
                name: true,
                email: true,
            },
        });
    }

    public async getProfile(id: string) {
        const profile = await this.getUserById(id);

        const { password, ...rest } = profile;

        return rest;
    }
}
