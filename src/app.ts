import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from './config/cors';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';

export const createServer = async () => {
  try {
    const app = await NestFactory.create(AppModule, { cors });
    app.useGlobalPipes(new ValidationPipe());
    return app;
  } catch (error) {
    console.log('error', error);
  }
};
