import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Put,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../decorators/auth.decorator';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    async user(@Param('id') id: string) {
        return this.userService.getProfile(id);
    }

    @Get()
    async users() {
        return this.userService.getUsers();
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() dto: UserDto) {
        return this.userService.updateUser(id, dto);
    }
}
