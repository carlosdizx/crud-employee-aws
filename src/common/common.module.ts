import { Global, Module } from '@nestjs/common';
import { S3Service } from './service/aws.s3.service';
import DynamodbAdapter from './adapters/dynamodb.adapter';

@Global()
@Module({
  providers: [S3Service, DynamodbAdapter],
  exports: [S3Service, DynamodbAdapter],
})
export default class CommonModule {}
