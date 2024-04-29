import { PublicKey } from '@solana/web3.js';
import { ResourceId, SourceData } from '@dialectlabs/monitor';
import { Injectable, Logger } from '@nestjs/common';
import { Interval } from 'luxon';
import { chunk } from 'lodash';
import { allSettledWithErrorLogging } from './utils/error-handling-utils';
import { TokenMetadataService } from './token-metadata.service';

export type ExampleUserData = {
  value: number;
  subscriber: ResourceId;
};

@Injectable()
export class ExampleDataSource {
  constructor(private readonly tokenMetadataService: TokenMetadataService) {}

  private readonly logger = new Logger(ExampleDataSource.name);

  private value: number = 0;
  private incrementing: boolean = true;

  /**
   * Poll data for all subscribers, this function is called at a regular interval.
   * The function assumes that data is fetched separately for each subscriber from a remote network source.
   * Performance: to avoid potential rate limiting, the function fetches data for subscribers in chunks. Chunks are processed sequentially, but fetching data within a chunk is done in parallel.
   * Reliability: error fetching data for a single subscriber does not affect fetching data for other subscribers.
   * @param subscribers list of subscribers to fetch data for
   * @returns {Promise<SourceData<ExampleUserData>[]>} a single array of data for all subscribers
   */
  async pollData(
    subscribers: ResourceId[],
  ): Promise<SourceData<ExampleUserData>[]> {
    const now = new Date();
    const sourceData: SourceData<ExampleUserData>[] = []; // Single array for data across all subscribers
    const chunkedSubscribers = chunk(subscribers, 10); // avoid potential rate limiting on RPC calls
    for (const chunk of chunkedSubscribers) {
      const { fulfilledResults } = await allSettledWithErrorLogging(
        chunk.map((subscriber) => this.getExampleUserData(subscriber)),
        (errors) => `Error fetching user data: ${errors.join(', ')}`,
      );
      fulfilledResults.forEach((userData) => {
        sourceData.push(userData);
      });
    }
    this.logger.log(
      `Elapsed ${Interval.fromDateTimes(now, new Date()).toDuration(
        'seconds',
      )} to poll data for ${subscribers.length} subscribers`,
    );
    return sourceData;
  }

  /**
   * Fetch example user data for a single subscriber.
   * Assumes that data is fetched from a remote source separately for each subscriber.
   * @param subscriber a public key of the subscriber
   * @returns {Promise<SourceData<ExampleUserData>>} example user data
   */
  private async getExampleUserData(
    subscriber: PublicKey,
  ): Promise<SourceData<ExampleUserData>> {
    this.value = this.incrementing ? this.value + 0.1 : this.value - 0.1;
    if (this.value < 0.05 || this.value > 0.95) {
      this.incrementing = !this.incrementing;
    }
    return {
      data: {
        value: this.value,
        subscriber: subscriber,
      },
      groupingKey: subscriber.toBase58(),
    };
  }
}
