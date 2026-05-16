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
import { ContractResponseDto } from './dto/contracts-response.dto';
import { Auth } from '../decorators/auth.decorator';

@Controller('contracts')
export class ContractsController {
    constructor(private readonly contractsService: ContractsService) {}

    @Get()
    @Auth()
    async getContracts() {
        return this.contractsService.getContracts();
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post()
    @Auth()
    async createContract(@Body() dto: ContractDto) {
        return this.contractsService.createContract(dto);
    }

    @UsePipes(new ValidationPipe())
    @Delete(':id')
    @Auth()
    async deleteContract(@Param('id', ParseIntPipe) id: number) {
        return this.contractsService.deleteContract(id);
    }

    @Get(':id')
    @Auth()
    async getContract(@Param('id', ParseIntPipe) id: number) {
        const { updatedAt, createdAt, ...rest }: ContractResponseDto =
            await this.contractsService.getContractById(id);

        return rest;
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Put(':id')
    @Auth()
    async changeContract(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ContractDto,
    ) {
        return this.contractsService.updateContract(id, dto);
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post(':id/assign')
    @Auth()
    async assign(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
        return this.contractsService.assignEmployeeToContract(id, dto);
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Delete(':contractId/unassign/:employeeId')
    @Auth()
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
