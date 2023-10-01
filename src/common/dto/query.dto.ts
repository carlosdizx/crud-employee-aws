import { IsNotEmpty, IsString } from 'class-validator';

export default class QueryDto {
  @IsNotEmpty()
  @IsString()
  indexName: string;

  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}
