import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MonitoringService } from './monitoring.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [MonitoringService],
})
export class MonitoringModule {}
