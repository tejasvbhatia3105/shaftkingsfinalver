'use client';

import type { ReactNode } from 'react';
import { Tab as HUTab } from '@headlessui/react';
import { cn } from '../../utils/cn';

export type TabPanelsProps = {
  children: ReactNode;
  className?: string;
};

export type TabPanelProps = {
  children: ReactNode;
  className?: string;
};

export function TabPanels({ children, className }: TabPanelsProps) {
  return (
    <HUTab.Panels className={cn('w-fit', className)}>{children}</HUTab.Panels>
  );
}

export function TabPanel({ children, className }: TabPanelProps) {
  return (
    <HUTab.Panel className={cn('w-full', className)}>{children}</HUTab.Panel>
  );
}
