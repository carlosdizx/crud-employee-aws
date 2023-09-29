import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import CommonModule from './common/common.module';
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export default class AppModule {}
