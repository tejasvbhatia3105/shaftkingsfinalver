'use client';

import { Loading } from '@/components/Loading';
import { useEffect, useState } from 'react';
import { sendGTMEvent } from '@next/third-parties/google';
import { usePathname } from 'next/navigation';
import { GlobalProvider } from './Global';
import { MarketProvider } from './Market';
import { SolanaProvider } from './Solana';
import { TriadProvider } from './Triad';
import { UserProvider } from './User';

interface Props {
  children: React.ReactNode;
}

const AppProvider: React.FC<Props> = ({ children }) => {
  const [clientLoad, setClientLoad] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setClientLoad(false);
  }, []);

  useEffect(() => {
    return sendGTMEvent({
      event: 'page_view',
      pathname,
    });
  }, [pathname]);

  return clientLoad ? (
    <Loading />
  ) : (
    <GlobalProvider>
      <SolanaProvider>
        <UserProvider>
          <TriadProvider>
            <MarketProvider>{children}</MarketProvider>
          </TriadProvider>
        </UserProvider>
      </SolanaProvider>
    </GlobalProvider>
  );
};

export default AppProvider;
