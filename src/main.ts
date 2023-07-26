import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/global-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService();

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.setGlobalPrefix('api');
  app.enableCors({ origin: '*' });

  await app.listen(configService.getOrThrow('PORT'));
}

bootstrap();
