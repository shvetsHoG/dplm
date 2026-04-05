import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.enableCors({
        origin: ['http://localhost:4000'],
        credentials: true,
        exposedHeaders: 'set-cookie',
    });

    const port = process.env.APP_PORT;
    await app.listen(port || 3000);
}
bootstrap();
