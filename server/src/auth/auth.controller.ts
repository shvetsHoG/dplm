import {
    Body,
    Controller,
    HttpCode,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, RegisterDto } from '../dto/auth.dto';
import { Request, Response } from 'express';
import { Auth } from '../decorators/auth.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('login')
    public async login(
        @Body() dto: AuthDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { refreshToken, ...response } = await this.authService.login(dto);
        this.authService.addRefreshTokenToResponse(res, refreshToken);

        return response;
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('registration')
    public async register(
        @Body() dto: RegisterDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { refreshToken, ...response } =
            await this.authService.register(dto);
        this.authService.addRefreshTokenToResponse(res, refreshToken);

        return response;
    }

    @HttpCode(200)
    @Post('login/access-token')
    public async getNewTokens(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshTokenFromCookies =
            req.cookies[this.authService.REFRESH_TOKEN_NAME];

        if (!refreshTokenFromCookies) {
            this.authService.removeRefreshTokenFromResponse(res);
            throw new UnauthorizedException();
        }

        const { refreshToken, ...response } =
            await this.authService.getNewTokens(refreshTokenFromCookies);

        this.authService.addRefreshTokenToResponse(res, refreshToken);
        return response;
    }

    @HttpCode(200)
    @Post('logout')
    public async logout(@Res({ passthrough: true }) res: Response) {
        this.authService.removeRefreshTokenFromResponse(res);

        return true;
    }
}
