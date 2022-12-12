import { Solana } from '@dialectlabs/blockchain-sdk-solana';
import {
  Config,
  Dapps,
  DialectSdk as IDialectSdk,
  DialectSdkInfo,
  EncryptionKeysProvider,
  IdentityResolver,
  Messaging,
  TokenProvider,
  Wallets,
} from '@dialectlabs/sdk';

export abstract class DialectSdk implements IDialectSdk<Solana> {
  readonly config: Config;
  readonly identity: IdentityResolver;
  readonly tokenProvider: TokenProvider;
  readonly encryptionKeysProvider: EncryptionKeysProvider;
  readonly blockchainSdk: Solana;
  readonly dapps: Dapps;
  readonly info: DialectSdkInfo;
  readonly threads: Messaging;
  readonly wallet: Wallets;
}
