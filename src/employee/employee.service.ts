import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import DynamodbAdapter from '../common/adapters/dynamodb.adapter';
import ListDto from '../common/dto/list.dto';

@Injectable()
export class EmployeeService {
  private readonly table: string = 'employees';
  constructor(private readonly adapter: DynamodbAdapter) {}

  public createEmployee = async (dto: CreateEmployeeDto) => {
    const result = await this.adapter.createItem(this.table, dto);
    console.log('createEmployee');
    return result;
  };

  public listEmployees = async ({ limit, page }: ListDto) => {
    console.log({ limit, page });
    return await this.adapter.listItems(this.table, +limit, page);
  };
}
