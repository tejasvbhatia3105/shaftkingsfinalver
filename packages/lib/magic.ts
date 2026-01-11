import { OAuthExtension } from '@magic-ext/oauth';
import { SolanaExtension } from '@magic-ext/solana';
import { Magic } from 'magic-sdk';

const createMagic = () => {
  // Only create Magic instance if API key is provided
  const apiKey = process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY;
  
  if (typeof window === 'undefined' || !apiKey) {
    return null;
  }
  
  return new Magic(apiKey, {
    extensions: [
      new SolanaExtension({
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
      }),
      new OAuthExtension(),
    ],
  });
};

export const magic = createMagic();
