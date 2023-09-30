import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { S3ClientConfig } from '@aws-sdk/client-s3/dist-types/S3Client';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    const env = this.configService.getOrThrow('NODE_ENV');
    const config: S3ClientConfig = {};
    if (env === 'local') {
      config.endpoint = this.configService.getOrThrow('AWS_ENDPOINT');
    }
    config.region = this.configService.getOrThrow('AWS_REGION');

    this.s3Client = new S3Client(config);
  }
}
