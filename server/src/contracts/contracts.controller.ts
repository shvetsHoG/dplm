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
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { Auth } from '../decorators/auth.decorator';
import { ContractAssignDto, ContractDto } from './dto/contracts.dto';

@Controller('contracts')
export class ContractsController {
    constructor(private readonly contractsService: ContractsService) {}

    @Get()
    async getContracts() {}

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post()
    async createContract(@Body() dto: ContractDto) {
        return this.contractsService.createContract(dto);
    }

    @UsePipes(new ValidationPipe())
    @Delete(':id')
    async deleteContract() {}

    @Get(':id')
    async getContract(@Param('id', ParseIntPipe) id: number) {
        return this.contractsService.getContractById(id);
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Put(':id')
    async changeContract(
        @Param('id', ParseIntPipe) id: string,
        @Body() dto: ContractDto,
    ) {}

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post(':id/assign')
    async assign(
        @Param('id', ParseIntPipe) id: string,
        @Body() dto: ContractAssignDto,
    ) {}

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Delete(':id/assign/:id')
    async unassign(@Param('id', ParseIntPipe) id: string) {}
}
