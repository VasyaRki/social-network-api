import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { registrationEnumForGraphQL } from './utils/registration-enum.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  registrationEnumForGraphQL();
  await app.listen(3000);
}
bootstrap();
