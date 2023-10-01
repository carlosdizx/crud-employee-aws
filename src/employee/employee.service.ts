import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import DynamodbAdapter from '../common/adapters/dynamodb.adapter';

@Injectable()
export class EmployeeService {
  private readonly table: string = 'employees';
  constructor(private readonly adapter: DynamodbAdapter) {}

  public createEmployee = async (dto: CreateEmployeeDto) => {
    const result = await this.adapter.createItem(this.table, dto);
    console.log('createEmployee');
    return result;
  };

  public listEmployees = async () => {
    return await this.adapter.listItems(
      this.table,
      2,
      // 'a5b886af-9c69-4cfb-aa17-874c22e59893',
    );
  };
}
