import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';

const bootstrap = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  //Register error handler
  app.useGlobalFilters(new HttpExceptionFilter());

  await app
    .listen(3000)
    .then(() => {
      Logger.log(`App is listening on port: ${3000}`);
    });
}

bootstrap();
