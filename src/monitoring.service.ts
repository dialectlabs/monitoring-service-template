import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DappMessageActionType, DialectSdk } from '@dialectlabs/sdk';
import {
  AddTransformationsStep,
  DefineDataSourceStep,
  DialectSdkNotification,
  MonitorProps,
  Monitors,
  Pipelines,
  ResourceId,
  SourceData,
} from '@dialectlabs/monitor';
import { Solana } from '@dialectlabs/blockchain-sdk-solana';
import { Duration, Interval } from 'luxon';
import { allSettledWithErrorLogging } from './utils/error-handling-utils';
import { StdoutNotificationSink } from './utils/StdoutNotificationSink';
import { getExampleUserData, UserData } from './example-data-source';

@Injectable()
export class MonitoringService implements OnModuleInit {
  private readonly stdoutNotificationSink = new StdoutNotificationSink();
  private readonly logger = new Logger(MonitoringService.name);

  constructor(
    private readonly sdk: DialectSdk<Solana>,
  ) {}

  async onModuleInit() {
    const monitor = this.createRealDataSourceMonitor();
    monitor.start().catch(console.error);
  }

  createRealDataSourceMonitor(props?: MonitorProps) {
    return this.createMonitor(
      (monitorBuilder) => {
        return monitorBuilder.poll(async (subscribers: ResourceId[]) => {
          return this.pollData(subscribers);
        }, Duration.fromObject({ minutes: 5 }));
      }, // Polling interval for the above function.
      props,
    );
  }

  private async pollData(subscribers: ResourceId[]) {
    const now = new Date();
    const sourceData: SourceData<UserData>[] = [];
    subscribers.map(async (subscriber) => {
      const userData = await getExampleUserData(subscriber)
      sourceData.push(...userData);
    });
    return sourceData;
  }

  createMonitor(
    chooseDataSource: (
      monitorBuilder: DefineDataSourceStep<UserData>,
    ) => AddTransformationsStep<UserData>,
    props?: MonitorProps,
  ) {
    const monitorBuilder = Monitors.builder({
      sdk: this.sdk,
      ...props,
    });
    const monitor = chooseDataSource(
      monitorBuilder.defineDataSource<UserData>(),
    )
      .transform<number, number>({
        keys: ['value'],
        pipelines: [
          Pipelines.threshold({
            type: 'rising-edge',
            threshold: 0.15,
          }),
        ],
      })
      .notify()
      .dialectSdk(
        ({ context: { origin } }) => {
          const notification: DialectSdkNotification = {
            title: `Value rose above 0.15`,
            message: `The value of your variable just rose above 0.15. It is now ${origin.value}.`,
            actions: {
              type: DappMessageActionType.LINK,
              links: [
                {
                  label:'View',
                  url: `https://www.google.com/search?q=0.15&oq=0.15`,
                },
              ],
            },
          };
          this.logger.log(
            `Sending notification to ${origin.resourceId}: ${JSON.stringify(
              notification,
            )}`,
          );
          return notification;
        },
        // this.stdoutNotificationSink,
        { dispatch: 'unicast', to: ({ origin }) => origin.resourceId },
      )
      .also()
      .transform<number, number>({
        keys: ['value'],
        pipelines: [
          Pipelines.threshold({
            type: 'rising-edge',
            threshold: 0.85,
          }),
        ],
      })
      .notify()
      .dialectSdk(
        ({ context: { origin } }) => {
          const notification: DialectSdkNotification = {
            title: `Value rose above 0.85`,
            message: `The value of your variable just rose above 0.85. It is now ${origin.value}.`,
            actions: {
              type: DappMessageActionType.LINK,
              links: [
                {
                  label:'View',
                  url: `https://www.google.com/search?q=0.85&oq=0.85`,
                },
              ],
            },
          };
          this.logger.log(
            `Sending notification to ${origin.resourceId}: ${JSON.stringify(
              notification,
            )}`,
          );
          return notification;
        },
        // this.stdoutNotificationSink,
        { dispatch: 'unicast', to: ({ origin }) => origin.resourceId },
      )
      .also()
      .transform<number, number>({
        keys: ['value'],
        pipelines: [
          Pipelines.threshold({
            type: 'falling-edge',
            threshold: 0.25,
          }),
        ],
      })
      .notify()
      .dialectSdk(
        ({ context: { origin } }) => {
          const notification: DialectSdkNotification = {
            title: `Value fell below 0.25`,
            message: `The value of your variable just fell below 0.25. It is now ${origin.value}.`,
            actions: {
              type: DappMessageActionType.LINK,
              links: [
                {
                  label:'View',
                  url: `https://www.google.com/search?q=0.25&oq=0.25`,
                },
              ],
            },
          };
          this.logger.log(
            `Sending notification to ${origin.resourceId}: ${JSON.stringify(
              notification,
            )}`,
          );
          return notification;
        },
        // this.stdoutNotificationSink,
        { dispatch: 'unicast', to: ({ origin }) => origin.resourceId },
      )
      .also()
      .transform<number, number>({
        keys: ['value'],
        pipelines: [
          Pipelines.threshold({
            type: 'falling-edge',
            threshold: 0.75,
          }),
        ],
      })
      .notify()
      .dialectSdk(
        ({ context: { origin } }) => {
          const notification: DialectSdkNotification = {
            title: `Value fell below 0.75`,
            message: `The value of your variable just fell below 0.75. It is now ${origin.value}.`,
            actions: {
              type: DappMessageActionType.LINK,
              links: [
                {
                  label:'View',
                  url: `https://www.google.com/search?q=0.75&oq=0.75`,
                },
              ],
            },
          };
          this.logger.log(
            `Sending notification to ${origin.resourceId}: ${JSON.stringify(
              notification,
            )}`,
          );
          return notification;
        },
        // this.stdoutNotificationSink,
        { dispatch: 'unicast', to: ({ origin }) => origin.resourceId },
      )
      //
      // FINISH
      //
      .and()
      .build();
    return monitor;
  }
}
