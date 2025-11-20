import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { configure } from '@vendia/serverless-express';
import { AppModule } from './app.module';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let cachedServer;

export const handler = async (event, context) => {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    // Enable CORS - ADD THIS BEFORE useGlobalPipes
    nestApp.enableCors({
      origin: '*'
    });

    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('Bansay API')
      .setDescription('The Basay API, liability management system')
      .setVersion('1.0')
      .addTag('liability')
      .addBearerAuth()
      .build();
    const documentFactory = () => SwaggerModule.createDocument(nestApp, config);
    SwaggerModule.setup('api', nestApp, documentFactory);

    await nestApp.init();
    cachedServer = configure({ app: expressApp });
  }

  return cachedServer(event, context);
};