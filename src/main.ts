import { NestFactory } from '@nestjs/core';
import { MonitoringModule } from './monitoring.module';
import { Logger } from 'nestjs-pino';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MonitoringModule, {
    logger: ['log', 'warn', 'error'],
  });
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const logger = app.get(Logger);
  app.useLogger(logger);
  console.log = (it) => logger.log(it);
  console.error = (it) => logger.error(it);
  await app.listen(process.env.PORT ?? 0);
}

bootstrap();
