import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DictionaryModule } from './dictionary/dictionary.module';

@Module({
    imports: [ConfigModule.forRoot(), AuthModule, UserModule, DictionaryModule],
})
export class AppModule {}
