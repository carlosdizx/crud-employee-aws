import { Injectable, NotFoundException } from '@nestjs/common';
import RepositoryAdapterInterface from '../interfaces/repository.adapter.interface';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  QueryCommand,
  DynamoDBClientConfig,
  ScanCommandInput,
  ScanCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuid } from 'uuid';
import handleAwsException from '../exceptions/handle.aws.exception';
import flattenObject from '../utils/flatten.object';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class DynamodbAdapter implements RepositoryAdapterInterface {
  private readonly client: DynamoDBClient;

  constructor(private readonly configService: ConfigService) {
    const env = this.configService.getOrThrow('NODE_ENV');
    const config: DynamoDBClientConfig = {};
    if (env === 'local')
      config.endpoint = this.configService.getOrThrow('AWS_ENDPOINT');
    config.region = this.configService.getOrThrow('AWS_REGION_CONF');

    this.client = new DynamoDBClient({
      endpoint: config['endpoint'],
      region: config['region'],
    });
  }

  public listItems = async (
    tableName: string,
    limit: number,
    exclusiveStartKey?: any,
  ): Promise<any> => {
    const commandParams: ScanCommandInput = {
      TableName: tableName,
      Limit: limit,
    };

    if (exclusiveStartKey)
      commandParams.ExclusiveStartKey = {
        id: {
          S: exclusiveStartKey,
        },
      };

    try {
      const { Items, LastEvaluatedKey } = await this.client.send(
        new ScanCommand(commandParams),
      );

      if (Items && Items.length > 0) {
        const items = Items.map((item) => flattenObject(item));
        return {
          items,
          lastEvaluatedKey: LastEvaluatedKey,
        };
      }

      return {
        items: [],
        lastEvaluatedKey: null,
      };
    } catch (error) {
      handleAwsException(error);
    }
  };

  private convertValueToDynamoDBType = (
    value: any,
  ): { S: string } | { N: string } | { BOOL: boolean } => {
    switch (typeof value) {
      case 'object':
        return { S: JSON.stringify(value) };
      case 'number':
        return { N: value.toString() };
      case 'boolean':
        return { BOOL: value };
      default:
        return { S: value };
    }
  };

  private convertDataToDynamoDBFormat = (data: any): void => {
    const entries = Object.entries(data);

    for (const [key, value] of entries) {
      data[key] = this.convertValueToDynamoDBType(value);
    }
  };

  public createItem = async (tableName: string, data: any): Promise<any> => {
    this.convertDataToDynamoDBFormat(data);
    const command = new PutItemCommand({
      TableName: tableName,
      Item: {
        ...data,
        id: { S: uuid() },
        createAt: { S: new Date().toISOString() },
      },
    });
    try {
      await this.client.send(command);
    } catch (error) {
      handleAwsException(error);
    }
  };

  public getItemById = async (tableName: string, key: any): Promise<any> => {
    const command = new GetItemCommand({
      TableName: tableName,
      Key: { id: { S: key } },
    });
    try {
      const response = await this.client.send(command);
      if (response.Item) return flattenObject(response.Item);
      return null;
    } catch (error) {
      handleAwsException(error);
    }
  };

  public getItemsByKey = async (params: any): Promise<any[]> => {
    try {
      const { tableName, indexName, key, value, type } = params;
      const expressionAttributeValues: Record<string, any> = {
        ':indexValue': {},
      };
      expressionAttributeValues[':indexValue'][type] = value;
      const command = new QueryCommand({
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: `${key} = :indexValue`,
        ExpressionAttributeValues: expressionAttributeValues,
      });
      const { Items } = await this.client.send(command);

      if (Items && Items.length > 0)
        return Items.map((item) => flattenObject(item));
      else return null;
    } catch (error) {
      handleAwsException(error);
    }
  };

  public updateItemById = async (
    tableName: string,
    id: any,
    updateData: any,
  ): Promise<void> => {
    const itemResult = await this.getItemById(tableName, id);
    if (!itemResult)
      throw new NotFoundException(`Item with ID ${id} does not exist`);
    this.convertDataToDynamoDBFormat(updateData);
    updateData.updateAt = { S: new Date().toISOString() };

    const updateExpression =
      'SET ' +
      Object.keys(updateData)
        .map((attr) => `#${attr} = :${attr}`)
        .join(', ');
    const expressionAttributeNames = Object.keys(updateData).reduce(
      (names, attr) => {
        names[`#${attr}`] = attr;
        return names;
      },
      {},
    );
    const expressionAttributeValues = Object.entries(updateData).reduce(
      (values, [attr, value]) => {
        values[`:${attr}`] = value;
        return values;
      },
      {},
    );

    const command = new UpdateItemCommand({
      TableName: tableName,
      Key: { id: { S: id } },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    try {
      await this.client.send(command);
    } catch (error) {
      handleAwsException(error);
    }
  };

  public deleteItemById = async (tableName: string, id: any): Promise<void> => {
    console.log(`deleteItemById in ${tableName} for id:${id}`);
    console.log('in next commit');
  };
}
