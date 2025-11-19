import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { configure } from '@vendia/serverless-express';
import { AppModule } from './src/app.module';
import express from 'express';

let cachedServer;

export const handler = async (event, context) => {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    await nestApp.init();
    cachedServer = configure({ app: expressApp });
  }

  return cachedServer(event, context);
};