import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import DynamodbAdapter from '../common/adapters/dynamodb.adapter';
import ListDto from '../common/dto/list.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import QueryDto from '../common/dto/query.dto';
import { S3Service } from '../common/service/aws.s3.service';

@Injectable()
export class EmployeeService {
  private readonly table: string = 'employees';
  constructor(
    private readonly adapter: DynamodbAdapter,
    private readonly s3Service: S3Service,
  ) {}

  public createEmployee = async ({
    documentNumber,
    ...dto
  }: CreateEmployeeDto) => {
    let employeeFound: any;
    try {
      employeeFound = await this.findEmployeeByKey({
        indexName: 'documentNumber-index',
        key: 'documentNumber',
        value: documentNumber,
        type: 'S',
      });
    } catch (error) {
      employeeFound = null;
    }
    if (!employeeFound)
      await this.adapter.createItem(this.table, {
        ...dto,
        documentNumber,
      });
    else
      await this.adapter.updateItemById(
        this.table,
        employeeFound._id ? employeeFound._id : employeeFound.id,
        dto,
      );

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

  public findEmployeeByKey = async ({
    indexName,
    key,
    value,
    type,
  }: QueryDto) => {
    const params = {
      tableName: this.table,
      indexName,
      key,
      value,
      type,
    };
    const employees = await this.adapter.getItemsByKey(params);
    if (!employees)
      throw new NotFoundException(`Employee with ${key} '${value}' not found`);
    return employees[0];
  };

  public updateEmployeeById = async (id: string, dto: UpdateEmployeeDto) => {
    return await this.adapter.updateItemById(this.table, id, dto);
  };

  public deleteEmployeeById = async (id) => {
    await this.adapter.deleteItemById(this.table, id);
    await this.s3Service.deleteObjectsInPath(this.table, id);
  };
}
