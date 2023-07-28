import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/global-exception-filter';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService();

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.setGlobalPrefix('api');
  app.enableCors({ origin: '*', credentials: true });

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: '*',
    }),
  );

  await app.listen(configService.getOrThrow('PORT'));
}

bootstrap();
