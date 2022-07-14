import { NestFactory } from '@nestjs/core';
import { MonitoringModule } from './monitoring.module';

async function bootstrap() {
  const app = await NestFactory.create(MonitoringModule);
  await app.listen(3000);
}
bootstrap();
