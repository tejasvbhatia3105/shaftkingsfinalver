'use client';

import { Fragment, createContext } from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import { Tab as HUTab } from '@headlessui/react';
import { cn } from '../../utils/cn';

export type TabsProps = PropsWithChildren<{
  /** @default 'primary' */
  variant?: 'primary' | 'secondary' | 'tertiary';
  children: ReactNode;
  className?: string;
  onChange?: (index: number) => void;
  selectedIndex?: number;
  id?: string;
}>;

export const TabsContext = createContext<TabsProps['variant']>('primary');

export function Tabs({
  id,
  children,
  className,
  variant = 'primary',
  onChange,
  selectedIndex,
}: TabsProps) {
  return (
    <div className={cn('w-full relative', className)}>
      <HUTab.Group
        key={id}
        as={Fragment}
        onChange={onChange}
        selectedIndex={selectedIndex}
      >
        <TabsContext.Provider value={variant}>{children}</TabsContext.Provider>
      </HUTab.Group>
    </div>
  );
}
