import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import ListDto from '../common/dto/list.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.createEmployee(createEmployeeDto);
  }

  @Get()
  async list(@Query() dto: ListDto) {
    console.log(dto);
    dto.limit = parseInt(`${dto.limit}`, 10);
    return this.employeeService.listEmployees(dto);
  }

  @Post('bulk')
  async createBulk(@Body() employeesDto: CreateEmployeeDto[]) {
    if (employeesDto.length > 1000)
      throw new BadRequestException('Too many employees for bulk');
    return this.employeeService.createEmployeesBulk(employeesDto);
  }

  @Get('find/:id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.employeeService.findEmployee(id);
  }
}
