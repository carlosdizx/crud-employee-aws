import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

const bootstrap = async () => {
  const env = process.env.NODE_ENV;
  switch (env) {
    case undefined:
      break;
    case 'dev':
      dotenv.config({ path: '.env.dev' });
      break;
    case 'qa':
      dotenv.config({ path: '.env.qa' });
      break;
    case 'prod':
      dotenv.config({ path: '.env.prod' });
      break;
    default:
      dotenv.config({ path: '.env.local' });
      break;
  }
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(3000);
  console.log(`http://localhost:${3000}`);
};

(async () => {
  await bootstrap();
})();
