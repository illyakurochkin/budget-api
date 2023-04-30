import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from './config/cors';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors });
  await app.listen(process.env.PORT);
  console.log(`app listening on port ${process.env.PORT}...`);
}

bootstrap();
