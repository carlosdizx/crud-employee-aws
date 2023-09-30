import { IsNotEmpty, IsInstance } from 'class-validator';

export class uploadDto {
  @IsNotEmpty()
  bucketName: string;

  @IsNotEmpty()
  key: string;

  @IsInstance(Uint8Array)
  data: Uint8Array;
}
