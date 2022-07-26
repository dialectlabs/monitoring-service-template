import { createClient, createDappIfAbsent } from '@dialectlabs/monitor';
import { Backend, NodeDialectWalletAdapter } from '@dialectlabs/sdk';
import { Keypair, PublicKey } from '@solana/web3.js';

const main = async (): Promise<void> => {
  const dappPublicKeyFromEnv = process.env.DAPP_PUBLIC_KEY;
  if (!dappPublicKeyFromEnv) {
    return;
  }
  await startClients(dappPublicKeyFromEnv);
};

async function startClients(dappPublicKeyFromEnv: string) {
  const dappPublicKey = new PublicKey(dappPublicKeyFromEnv);
  if (dappPublicKeyFromEnv) {
    await Promise.all([
      createClient(
        {
          environment: 'local-development',
          backends: [Backend.Solana],
        },
        dappPublicKey,
      ),
      createClient(
        {
          environment: 'local-development',
          backends: [Backend.DialectCloud],
        },
        dappPublicKey,
      ),
    ]);
  }
}

main();
