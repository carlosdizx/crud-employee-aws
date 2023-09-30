import { Global, Module } from '@nestjs/common';
import { S3Service } from './service/aws.s3.service';

@Global()
@Module({
  providers: [S3Service],
  exports: [S3Service],
})
export default class CommonModule {}
