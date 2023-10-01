import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import ListDto from '../common/dto/list.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.createEmployee(createEmployeeDto);
  }

  @Get()
  list(@Query() dto: ListDto) {
    console.log(dto);
    dto.limit = parseInt(`${dto.limit}`, 10);
    return this.employeeService.listEmployees(dto);
  }
}
