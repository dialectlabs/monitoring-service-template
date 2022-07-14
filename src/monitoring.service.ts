import { Injectable, OnModuleInit } from '@nestjs/common';
import { DialectSdkDecorator } from './dialect-sdk.decorator';
import { Monitors } from '@dialectlabs/monitor';

@Injectable()
export class MonitoringService implements OnModuleInit {
  constructor(private readonly sdk: DialectSdkDecorator) {}

  onModuleInit() {
    Monitors.builder({
      sdk: this.sdk,
      sinks: {
        sms: {
          twilioUsername: process.env.TWILIO_ACCOUNT_SID!,
          twilioPassword: process.env.TWILIO_AUTH_TOKEN!,
          senderSmsNumber: process.env.TWILIO_SMS_SENDER!,
        },
        telegram: {
          telegramBotToken: process.env.TELEGRAM_TOKEN!,
        },
        email: {
          apiToken: process.env.SENDGRID_KEY!,
          senderEmail: process.env.SENDGRID_EMAIL!,
        },
      },
    });
    // Add monitoring service
  }
}
