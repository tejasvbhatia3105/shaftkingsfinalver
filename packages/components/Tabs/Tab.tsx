'use client';

import { Tab as HUTab } from '@headlessui/react';
import type { ReactNode } from 'react';
import { useContext } from 'react';
import { TabsContext } from '.';
import { cn } from '../../utils/cn';

export type TabListProps = {
  children: ReactNode;
  className?: string;
};

export type TabProps = {
  title: string;
  className?: string;
  id: string;
  icon?: ReactNode;
  count?: number;
  onClick?: () => void;
};

export function TabList({ children, className }: TabListProps) {
  const variant = useContext(TabsContext);

  return (
    <HUTab.List
      className={cn(
        'relative flex w-full items-baseline border-b border-[#E5E5E5] dark:border-white/5',
        {
          'mb-5': variant === 'primary',
          'justify-center gap-x-20': variant === 'secondary',
          'border-b-0  bg-shaftkings-gray-200/70 dark:bg-[#1C1D23] border-t border-x rounded-t-lg':
            variant === 'tertiary',
        },
        className
      )}
    >
      {children}
    </HUTab.List>
  );
}

export function Tab({
  title,
  className: classNameProp,
  id,
  count,
  icon,
  onClick,
}: TabProps) {
  const variant = useContext(TabsContext);

  const getPrimaryTabClassName = (selected: boolean) => {
    if (variant !== 'primary') return '';

    const className = {
      base: 'items-center py-3 px-4',
      selected:
        'text-black dark:text-white border-b-2 border-b-black dark:border-b-white dark:bg-white/[0.08]',
      notSelected:
        'hover:text-black dark:hover:text-white text-[#C0C0C0] border-b-2 hover:border-b-white/50',
    };

    return `${className.base} ${
      selected ? className.selected : className.notSelected
    }`;
  };

  const getSecondaryTabClassName = (selected: boolean) => {
    if (variant !== 'secondary') return '';

    const className = {
      base: 'items-center py-3 px-4',
      selected: 'text-white border-b-2 border-b-white',
      notSelected:
        'text-[#C0C0C0] hover:text-white border-b-2 hover:border-b-white',
    };

    return `${className.base} ${
      selected ? className.selected : className.notSelected
    }`;
  };

  const getTertiaryTabClassName = (selected: boolean) => {
    if (variant !== 'tertiary') return '';

    const className = {
      base: 'items-center py-3 px-6 mr-0 h-11',
      selected:
        'text-shaftkings-dark-100 dark:text-white bg-black/5 dark:bg-white/[0.08]',
      notSelected:
        'text-[#C0C0C0] hover:bg-black/10 dark:hover:bg-white/[0.05] dark:hover:text-white bg-shaftkings-gray-200/80 dark:bg-transparent',
    };

    return `${className.base} ${
      selected ? className.selected : className.notSelected
    }`;
  };

  return (
    <HUTab
      onClick={onClick}
      data-qa-id={`tab:${id}`}
      className={({ selected }) =>
        cn(
          'flex relative w-fit text-sm font-medium outline-0 border-transparent mr-0.5 last-of-type:mr-0',
          {
            [getPrimaryTabClassName(selected)]: variant === 'primary',
            [getSecondaryTabClassName(selected)]: variant === 'secondary',
            [getTertiaryTabClassName(selected)]: variant === 'tertiary',
          },
          classNameProp
        )
      }
    >
      <span
        className={cn({
          'relative flex items-center': variant === 'primary',
        })}
      >
        {title === 'Opened Trades' && (
          <span className="relative mr-2.5 flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-shaftkings-green-200 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-shaftkings-green-250"></span>
          </span>
        )}
        <span className="flex items-center gap-3">
          {icon && icon}
          {title}
          {Number(count) > 0 && (
            <span className="flex h-[16px] min-w-[16px] items-center justify-center rounded-[2px] bg-white text-xs text-shaftkings-dark-100 dark:bg-white/25 dark:text-white">
              {count}
            </span>
          )}
        </span>
      </span>
    </HUTab>
  );
}
