import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
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

  public listObjects = async (
    bucketName: string,
    path?: string,
  ): Promise<string[]> => {
    try {
      const prefix = path ? `${path}/` : '';

      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
      });

      const response = await this.s3Client.send(command);

      return response.Contents?.map((object) => object.Key) || [];
    } catch (error) {
      throw new InternalServerErrorException(
        `Error listing objects in bucket ${bucketName}: ${error.message}`,
      );
    }
  };

  public deleteObjectsInPath = async (
    bucketName: string,
    path: string,
  ): Promise<void> => {
    try {
      const objectsToDelete: string[] = await this.listObjects(
        bucketName,
        path,
      );
      if (objectsToDelete.length === 0) return;

      const deleteCommands = objectsToDelete.map((objectKey) => ({
        Bucket: bucketName,
        Key: objectKey,
      }));

      for (const deleteCommand of deleteCommands) {
        await this.s3Client.send(new DeleteObjectCommand(deleteCommand));
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting objects in path '${path}' in bucket ${bucketName}: ${error.message}`,
      );
    }
  };
}
