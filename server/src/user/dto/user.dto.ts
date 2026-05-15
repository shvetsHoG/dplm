import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UserDto {
    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @MinLength(8, {
        message: 'Пароль должен быть не менее 8 символов',
    })
    @IsString()
    password: string;
}
