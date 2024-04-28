import { Connection, PublicKey } from '@solana/web3.js';
import { ResourceId, SourceData } from '@dialectlabs/monitor';
import { Injectable } from '@nestjs/common';

export type UserData = {
  value: number;
  resourceId: ResourceId;
};

let value: number = 0;
let incrementing: boolean = true;

export async function getExampleUserData(
  publicKey: PublicKey,
): Promise<SourceData<UserData>[]> {
  const userData: SourceData<UserData>[] = [];
  value = incrementing ? value + 0.1 : value - 0.1;
  console.log({value});
  if (value < 0.05 || value > 0.95) incrementing = !incrementing;
  userData.push({
    data: {
      value,
      resourceId: publicKey,
    },
    groupingKey: publicKey.toBase58(),
  })
  return userData;
}
