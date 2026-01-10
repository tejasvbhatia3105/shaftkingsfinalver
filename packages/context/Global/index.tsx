'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

type GlobalProviderProps = {
  children: ReactNode;
};

export type ContextValue = {
  isModalOpen: boolean;
  rulesModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  loadingGlobal: boolean;
  setLoadingGlobal: (value: boolean) => void;
  setRulesModalOpen: (value: boolean) => void;
  homeTab: number;
  setHomeTab: React.Dispatch<React.SetStateAction<number>>;
};

export const GlobalContext = createContext<ContextValue | undefined>(undefined);

export function GlobalProvider({ children, ...rest }: GlobalProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [homeTab, setHomeTab] = useState(0);

  const value = useMemo(
    () => ({
      isModalOpen,
      setIsModalOpen,
      loadingGlobal,
      setLoadingGlobal,
      rulesModalOpen,
      setRulesModalOpen,
      homeTab,
      setHomeTab,
    }),
    [isModalOpen, loadingGlobal, rulesModalOpen, homeTab, setHomeTab]
  );

  return (
    <GlobalContext.Provider value={value} {...rest}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobal = (): ContextValue => {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error('useGlobal must be used within an GlobalProvider');
  }

  return context;
};
