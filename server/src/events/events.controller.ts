import {
    Body,
    Controller,
    Delete,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsCreateDto } from './dto/events.dto';

@Controller('employees')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}
    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post(':employeeId/events')
    async createEvent(
        @Param('employeeId', ParseIntPipe) employeeId: number,
        @Body() dto: EventsCreateDto,
    ) {
        return this.eventsService.createEvent(employeeId, dto);
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Delete(':employeeId/events/:eventId')
    async unassign(
        @Param('employeeId', ParseIntPipe) employeeId: number,
        @Param('eventId', ParseIntPipe) eventId: number,
    ) {
        return this.eventsService.deleteEvent(employeeId, eventId);
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Put(':employeeId/events/:eventId')
    async changeContract(
        @Param('employeeId', ParseIntPipe) employeeId: number,
        @Param('eventId', ParseIntPipe) eventId: number,
        @Body() dto: EventsCreateDto,
    ) {
        return this.eventsService.changeEvent(employeeId, eventId, dto);
    }
}
