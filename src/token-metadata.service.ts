import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { keyBy } from 'lodash';
import { Interval } from 'luxon';

@Injectable()
export class TokenMetadataService implements OnModuleInit {
  private readonly logger = new Logger(TokenMetadataService.name);
  private readonly cache: Record<string, TokenMetadata> = {};

  async onModuleInit() {
    this.logger.log(`Initializing token metadata cache...`);
    await this.cacheTokenMetadata();
  }

  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: 'cacheTokenMetadata',
  })
  private async cacheTokenMetadata() {
    const now = new Date();
    const response = await fetch('https://token.jup.ag/all');
    const tokenMetadata: TokenMetadata[] = await response.json();
    const tokenMetadataByAddress: Record<string, TokenMetadata> = keyBy(
      tokenMetadata,
      (it) => it.address,
    );
    Object.assign(this.cache, tokenMetadataByAddress);
    this.logger.log(
      `Elapsed ${Interval.fromDateTimes(now, new Date()).toDuration(
        'seconds',
      )} to cache ${tokenMetadata.length} tokens`,
    );
  }

  async getTokenMetadata(publicKey: string) {
    return this.cache[publicKey];
  }
}

export interface TokenMetadata {
  address: string; // "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
  chainId: number; // 101
  decimals: number; // 6
  name: string; // "USDT"
  symbol: string; // "USDT"
  logoURI: string; // "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg"
  tags: string[]; // ["old-registry", "solana-fm" ]
  extensions: TokenMetadataExtensions; // { "coingeckoId": "tether" }
}

interface TokenMetadataExtensions {
  [key: string]: string;
}
