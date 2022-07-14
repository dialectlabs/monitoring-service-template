import { Injectable } from '@nestjs/common';

@Injectable()
export class MonitoringService {
  getHello(): string {
    return 'Hello World!';
  }
}
