import type {
  PublicKey,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js';
import type { PromiEvent } from 'magic-sdk';

export type LoginProvider = 'google' | 'discord' | 'apple';

export type WalletAdapter = {
  wallet?: {
    adapter: {
      name: string;
      icon: string;
    };
  };
};

export type WalletTransactions =
  | (<T extends Transaction | VersionedTransaction>(
      transaction: T
    ) => Promise<T>)
  | undefined;

export type WalletAllTransactions =
  | (<T extends Transaction | VersionedTransaction>(
      transactions: T[]
    ) => Promise<T[]>)
  | undefined;

export interface WalletProps {
  connected: boolean;
  publicKey: PublicKey;
  disconnect: () => Promise<void>;
  signTransaction: WalletTransactions;
  signAllTransactions: WalletAllTransactions;
  signMessage:
    | ((message: string | Uint8Array) => PromiEvent<
        Uint8Array,
        {
          done: (result: Uint8Array) => void;
          error: (reason: unknown) => void;
          settled: () => void;
        }
      >)
    | undefined;

  wallet?: {
    adapter: {
      name: string;
      icon: string;
    };
  };
}
