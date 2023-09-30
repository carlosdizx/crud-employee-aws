import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../common/service/aws.s3.service';
import { FileUpload } from '../common/interfaces/file-upload';

@Controller('employee/file')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() { buffer, originalname }: FileUpload) {
    const [name, extension] = originalname.split('.');
    const result = await this.s3Service.uploadFile({
      bucketName: 'employees',
      key: `${name}.${extension}`,
      data: buffer,
    });

    return { result };
  }

  @Get('upload')
  async listObjects() {
    return this.s3Service.listObjects('employees');
  }
}
