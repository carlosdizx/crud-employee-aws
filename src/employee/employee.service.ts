import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import DynamodbAdapter from '../common/adapters/dynamodb.adapter';
import ListDto from '../common/dto/list.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  private readonly table: string = 'employees';
  constructor(private readonly adapter: DynamodbAdapter) {}

  public createEmployee = async (dto: CreateEmployeeDto) => {
    await this.adapter.createItem(this.table, dto);
    return { message: `Employee created` };
  };

  public listEmployees = async ({ limit, page }: ListDto) =>
    await this.adapter.listItems(this.table, +limit, page);

  public createEmployeesBulk = async (employeeList: CreateEmployeeDto[]) => {
    const promises = employeeList.map(async (employeeDto) => {
      return await this.createEmployee(employeeDto);
    });

    await Promise.all(promises);
    return { message: `Employees ${employeeList.length} registered` };
  };

  public findEmployeeById = async (id: string) => {
    const employee = await this.adapter.getItemById(this.table, id);
    if (!employee)
      throw new NotFoundException(`Employee with id ${id} not found`);
    return employee;
  };

  public updateEmployeeById = async (id: string, dto: UpdateEmployeeDto) => {
    return await this.adapter.updateItemById(this.table, id, dto);
  };
}
