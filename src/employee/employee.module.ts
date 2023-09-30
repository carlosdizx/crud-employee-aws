import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { UploadController } from './upload.controller';

@Module({
  controllers: [EmployeeController, UploadController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
