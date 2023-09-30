import { Request } from 'express';
import { InternalServerErrorException } from '@nestjs/common';

const fileValidate = (req: Request, file: any, callback: any) => {
  if (!file)
    return callback(new InternalServerErrorException('File not found'), false);
  callback(null, true);
};

export default fileValidate;
