import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { LoggerModule } from 'nestjs-pino';
import { HttpModule } from '@nestjs/axios';// Common imports
import {
  Dialect,
  DialectCloudEnvironment,
  DialectSdk,
  Environment,
} from '@dialectlabs/sdk';

// Solana-specific imports
import {
  Solana,
  SolanaSdkFactory,
  NodeDialectSolanaWalletAdapter
} from '@dialectlabs/blockchain-sdk-solana';
//import { DialectSdk } from './dialect-sdk';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    ConfigModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: process.env.ENVIRONMENT !== 'production',
        redact: ['req.headers'],
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: process.env.ENVIRONMENT === 'local-development',
            translateTime: true,
            singleLine: true,
            ignore: 'pid,hostname',
          },
        },
      },
    }),
  ],
  controllers: [HealthController],
  providers: [
    MonitoringService,
    {
      provide: DialectSdk<Solana>,
      useValue: Dialect.sdk(
        {
          environment: process.env.DIALECT_SDK_ENVIRONMENT as Environment,
        },
        SolanaSdkFactory.create({
          // IMPORTANT: must set environment variable DIALECT_SDK_CREDENTIALS
          // to your dapp's Solana messaging wallet keypair e.g. [170,23, . . . ,300]
          wallet: NodeDialectSolanaWalletAdapter.create(),
        }),
      ),
    },
  ],
})
export class AppModule {}
