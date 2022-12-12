import { Injectable, OnModuleInit } from '@nestjs/common';
import { DialectSdk } from '@dialectlabs/sdk'
import { Monitors } from '@dialectlabs/monitor';
import { Solana } from '@dialectlabs/blockchain-sdk-solana';

@Injectable()
export class MonitoringService implements OnModuleInit {
  constructor(private readonly sdk: DialectSdk<Solana>) {}

  onModuleInit() {
    Monitors.builder({
      sdk: this.sdk,
    });
  }
}
