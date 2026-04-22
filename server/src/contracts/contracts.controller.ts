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
import { ContractDto } from './dto/contracts.dto';

@Controller('contracts')
export class ContractsController {
    constructor(private readonly contractsService: ContractsService) {}

    @Get()
    async getContracts() {
        return this.contractsService.getContracts();
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post()
    async createContract(@Body() dto: ContractDto) {
        return this.contractsService.createContract(dto);
    }

    @UsePipes(new ValidationPipe())
    @Delete(':id')
    async deleteContract(@Param('id', ParseIntPipe) id: number) {
        return this.contractsService.deleteContract(id);
    }

    @Get(':id')
    async getContract(@Param('id', ParseIntPipe) id: number) {
        return this.contractsService.getContractById(id);
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Put(':id')
    async changeContract(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ContractDto,
    ) {
        return this.contractsService.updateContract(id, dto);
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post(':id/assign')
    async assign(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
        return this.contractsService.assignEmployeeToContract(id, dto);
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Delete(':contractId/unassign/:employeeId')
    async unassign(
        @Param('contractId', ParseIntPipe) contractId: number,
        @Param('employeeId') employeeId: string,
    ) {
        return this.contractsService.unassignEmployeeFromContract(
            contractId,
            employeeId,
        );
    }
}
