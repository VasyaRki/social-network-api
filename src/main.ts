import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/global-exception-filter';
import cors from 'cors';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService();

  app.use(cookieParser());
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.setGlobalPrefix('api');
  app.enableCors({ origin: '*', credentials: true });

  await app.listen(configService.getOrThrow('PORT'));
}

bootstrap();
