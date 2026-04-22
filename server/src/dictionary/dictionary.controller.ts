import { Controller, Get } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { Auth } from '../decorators/auth.decorator';

@Controller('dictionary')
export class DictionaryController {
    constructor(private readonly dictionaryService: DictionaryService) {}

    @Get('weekdays')
    async getWeekdays() {
        return this.dictionaryService.getWeekdays();
    }

    @Get('contract_types')
    async getContractTypes() {
        return this.dictionaryService.getContractTypes();
    }

    @Get('event_types')
    async getEventTypes() {
        return this.dictionaryService.getEventTypes();
    }
}
