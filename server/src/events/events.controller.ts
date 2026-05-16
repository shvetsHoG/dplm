import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsCreateDto, QueryCalendarDto } from './dto/events.dto';
import { Auth } from '../decorators/auth.decorator';

@Controller('employees')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post(':employeeId/events')
    @Auth()
    async createEvent(
        @Param('employeeId') employeeId: string,
        @Body() dto: EventsCreateDto,
    ) {
        return this.eventsService.createEvent(employeeId, dto);
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Delete(':employeeId/events/:eventId')
    @Auth()
    async unassign(
        @Param('employeeId') employeeId: string,
        @Param('eventId', ParseIntPipe) eventId: number,
    ) {
        return this.eventsService.deleteEvent(employeeId, eventId);
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Put(':employeeId/events/:eventId')
    @Auth()
    async changeContract(
        @Param('employeeId') employeeId: string,
        @Param('eventId', ParseIntPipe) eventId: number,
        @Body() dto: EventsCreateDto,
    ) {
        return this.eventsService.changeEvent(employeeId, eventId, dto);
    }

    @Get('calendar')
    @Auth()
    async getCalendar(@Query() query: QueryCalendarDto) {
        return this.eventsService.getCalendar(query);
    }
}
