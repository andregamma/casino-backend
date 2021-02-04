import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { initAdapters } from './main/resources/adapters/InitAdapters';
import { NestApplication } from './main/resources/utils/NestApplication';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ credentials: true, origin: true });

  NestApplication.getInstance(app);

  initAdapters(app);

  await app.listen(process.env.SERVER_HTTP_PORT, () => {
    Logger.log(process.env.SERVER_HTTP_PORT, 'HttpPort');
  });
}
bootstrap();
