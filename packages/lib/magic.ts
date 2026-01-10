import { OAuthExtension } from '@magic-ext/oauth';
import { SolanaExtension } from '@magic-ext/solana';
import { Magic } from 'magic-sdk';

const createMagic = () => {
  return typeof window !== 'undefined'
    ? new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY as string, {
        extensions: [
          new SolanaExtension({
            rpcUrl: 'https://api.mainnet-beta.solana.com',
          }),
          new OAuthExtension(),
        ],
      })
    : null;
};

export const magic = createMagic();
