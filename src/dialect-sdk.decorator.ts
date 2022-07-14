import { DialectSdk as IDialectSdk } from '@dialectlabs/sdk/lib/types/sdk/sdk.interface';
import { Dapps, DialectSdkInfo, Messaging, Wallets } from '@dialectlabs/sdk';

export abstract class DialectSdkDecorator implements IDialectSdk {
  readonly dapps: Dapps;
  readonly info: DialectSdkInfo;
  readonly threads: Messaging;
  readonly wallet: Wallets;
}
