import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../common/service/aws.s3.service';
import { FileUpload } from '../common/interfaces/file-upload';
import fileValidate from '../common/helpers/fileFilter.helper';

@Controller('employee/file')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileValidate,
    }),
  )
  async uploadFile(@UploadedFile() file: FileUpload) {
    if (!file) throw new BadRequestException('File not found in request');
    const [name, extension] = file.originalname.split('.');
    const result = await this.s3Service.uploadFile({
      bucketName: 'employees',
      key: `${name}.${extension}`,
      data: file.buffer,
    });

    return { result };
  }

  @Get('upload')
  async listObjects() {
    return this.s3Service.listObjects('employees');
  }
}
