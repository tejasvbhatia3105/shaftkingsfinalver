'use client';

import { RPC_URL } from '@/constants/rpc';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  Coin98WalletAdapter,
  NightlyWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolongWalletAdapter,
  TorusWalletAdapter,
  WalletConnectWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { Connection } from '@solana/web3.js';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

type SolanaProviderProps = {
  children: ReactNode;
};

export type ContextValue = {
  connection: Connection;
  openConnect: boolean;
  setOpenConnect: Dispatch<SetStateAction<boolean>>;
};

export const SolanaContext = createContext<ContextValue | undefined>(undefined);

export function SolanaProvider({ children, ...rest }: SolanaProviderProps) {
  const [openConnect, setOpenConnect] = useState(false);
  const connection = useMemo(() => new Connection(RPC_URL), []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new NightlyWalletAdapter(),
      new WalletConnectWalletAdapter({
        network: WalletAdapterNetwork.Mainnet,
        options: {},
      }),
      new Coin98WalletAdapter(),
      new TorusWalletAdapter(),
      new SolongWalletAdapter(),
    ],
    []
  );

  const value = useMemo(
    () => ({
      connection,
      openConnect,
      setOpenConnect,
    }),
    [connection, openConnect, setOpenConnect]
  );

  return (
    <SolanaContext.Provider value={value} {...rest}>
      <ConnectionProvider endpoint={RPC_URL}>
        <WalletProvider wallets={wallets} autoConnect>
          {children}
        </WalletProvider>
      </ConnectionProvider>
    </SolanaContext.Provider>
  );
}

export const useSolana = (): ContextValue => {
  const context = useContext(SolanaContext);

  if (context === undefined) {
    throw new Error('useSolana must be used within an SolanaProvider');
  }

  return context;
};
