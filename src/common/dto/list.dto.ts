import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export default class ListDto {
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number;

  @IsOptional()
  page?: any;
}
