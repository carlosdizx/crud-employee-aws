import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import DynamodbAdapter from '../common/adapters/dynamodb.adapter';

@Injectable()
export class EmployeeService {
  private readonly table: string = 'employees';
  constructor(private readonly adapter: DynamodbAdapter) {}

  public createEmployee = async (dto: CreateEmployeeDto) => {
    const result = await this.adapter.createItem(this.table, {
      documentNumber: dto.documentNumber,
    });
    console.log('createEmployee');
    return result;
  };
}
