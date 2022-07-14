import { Injectable, OnModuleInit } from '@nestjs/common';
import { DialectSdkDecorator } from './dialect-sdk.decorator';
import { Monitors } from '@dialectlabs/monitor';

@Injectable()
export class MonitoringService implements OnModuleInit {
  constructor(private readonly sdk: DialectSdkDecorator) {}

  onModuleInit() {
    Monitors.builder({ sdk: this.sdk });
    // Add monitoring service
  }
}
