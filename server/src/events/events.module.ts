import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaService } from '../prisma.service';
import { ContractsService } from '../contracts/contracts.service';

@Module({
    controllers: [EventsController],
    providers: [EventsService, PrismaService, ContractsService],
    exports: [EventsService],
})
export class EventsModule {}
