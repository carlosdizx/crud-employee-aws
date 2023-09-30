import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DocumentTypesEnum } from '../enums/document-types.enum';
import { GenderEnum } from '../enums/gender.enum';

export class CreateEmployeeDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  documentNumber: string;

  @IsEnum(DocumentTypesEnum)
  @IsNotEmpty()
  documentType: DocumentTypesEnum;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(25)
  phone: string;

  @IsNotEmpty()
  @MaxLength(4)
  @Matches(/^\+\d{2,4}$/)
  codePhone: string;

  @IsNotEmpty()
  dateOfBirth: Date;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  address: string;

  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: GenderEnum;
}
