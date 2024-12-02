import { createServer } from './app';

async function bootstrap() {
  const app = await createServer();
  await app.listen(process.env.PORT);
  console.log(`app listening on port ${process.env.PORT}...`);
}

bootstrap();
