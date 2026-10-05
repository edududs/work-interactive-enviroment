import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureHttp } from './http-app.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  configureHttp(app, process.env.WEB_ORIGIN ?? 'http://localhost:3000');
  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  console.log(`API em http://localhost:${String(port)}`);
}

void bootstrap();
