import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { S3ClientConfig } from '@aws-sdk/client-s3/dist-types/S3Client';
import { uploadDto } from '../dto/s3.dto';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    const env = this.configService.getOrThrow('NODE_ENV');
    const config: S3ClientConfig = {};
    if (env === 'local') {
      config.endpoint = this.configService.getOrThrow('AWS_ENDPOINT');
    }
    config.region = this.configService.getOrThrow('AWS_REGION_CONF');

    this.s3Client = new S3Client({
      endpoint: config['endpoint'],
      region: config['region'],
    });
  }
  public uploadFile = async ({ bucketName, key, data }: uploadDto) => {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: data,
      });

      return await this.s3Client.send(command);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error uploading file to bucket ${bucketName}: ${error.message}`,
      );
    }
  };
}
