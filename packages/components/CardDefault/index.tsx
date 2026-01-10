'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/utils/cn';

type CardDefaultProps = {
  className?: string;
  children: React.ReactNode;
};

export function CardDefault({ className, children }: CardDefaultProps) {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        'rounded-3xl h-fit w-full px-2 py-3 lg:px-4 lg:py-5',
        'transition-colors duration-200',
        {
          'bg-shaftkings-dark-300': theme === 'dark',
          'bg-white': theme === 'light',
        },
        className
      )}
    >
      {children}
    </div>
  );
}
