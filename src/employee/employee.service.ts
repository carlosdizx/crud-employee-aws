import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import DynamodbAdapter from '../common/adapters/dynamodb.adapter';

@Injectable()
export class EmployeeService {
  private readonly table: string = 'employees';
  constructor(private readonly adapter: DynamodbAdapter) {}

  public createEmployee = ({}: CreateEmployeeDto) => {
    console.log('createEmployee');
  };
}
