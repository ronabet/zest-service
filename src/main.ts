import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { BadRequestException, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const bootstrap = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  //Register error handler
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    disableErrorMessages: false, // Set to true in production if you don't want to expose validation failure details
    exceptionFactory: (errors) => new BadRequestException(errors),
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Github top ranked service')
    .setDescription('')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app
    .listen(3000)
    .then(() => {
      Logger.log(`App is listening on port: ${3000}`);
    });
}

bootstrap();
