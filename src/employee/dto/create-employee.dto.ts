import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(25)
  phone: string;

  @IsNotEmpty()
  @MaxLength(4)
  codePhone: string;
}
