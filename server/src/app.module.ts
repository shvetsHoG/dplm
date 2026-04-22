import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DictionaryModule } from './dictionary/dictionary.module';
import { ContractsModule } from './contracts/contracts.module';
import { EventsModule } from './events/events.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        AuthModule,
        UserModule,
        DictionaryModule,
        ContractsModule,
        EventsModule,
    ],
})
export class AppModule {}
