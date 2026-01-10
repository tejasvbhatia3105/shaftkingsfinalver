'use client';

import { cn } from '@/utils/cn';
import { InterFont } from '@/utils/fonts';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  IconClose,
  IconExpand,
  IconLoadingSecondary,
  IconOutErrorCircle,
  IconSuccess,
} from '../Icons';

type CustomToastProps = {
  title: string | JSX.Element;
  description?: string | ReactNode;
  isLoading?: boolean;
  type: 'success' | 'error' | 'info';
  isDropdown?: boolean;
  link?: {
    href: string;
    name: string;
  };
  duration?: number;
  manualProgress?: number;
  forceExpand?: boolean;
};

export function Toastfy({
  title,
  description,
  type,
  link,
  isDropdown = true,
  duration,
  isLoading,
  forceExpand,
  manualProgress,
}: CustomToastProps) {
  const [progressValue, setProgressValue] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [descHeight, setDescHeight] = useState(0);
  const descRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (manualProgress !== undefined) {
      setProgressValue(manualProgress);
      return;
    }

    const interval = setInterval(() => {
      setProgressValue((oldProgress) => {
        if (isLoading) {
          const next = oldProgress + 0.5;
          return next >= 50 ? 50 : next;
        }
        const increment = 100 / ((duration || 0) / 100);
        const next = oldProgress + increment;
        return next >= 100 ? 100 : next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, isLoading, manualProgress]);

  useEffect(() => {
    if (descRef.current) {
      setDescHeight(descRef.current.scrollHeight);
    }
  }, [description, isExpanded]);

  useEffect(() => {
    if (forceExpand) {
      setIsExpanded(true);
    }
  }, [forceExpand]);

  const toggleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  }, []);

  const renderIcons = (currentType: string) => {
    if (currentType === 'info') return <IconLoadingSecondary />;
    if (currentType === 'success')
      return <IconSuccess className="fill-shaftkings-green-200" />;
    if (currentType === 'error')
      return <IconOutErrorCircle className="fill-shaftkings-red-200" />;
    return null;
  };

  const getBaseColor = useCallback(
    (typeToast: 'success' | 'error' | 'info') => {
      switch (typeToast) {
        case 'success':
          return '#00B471';
        case 'error':
          return '#EE5F67';
        case 'info':
          return '#F8E173';
        default:
          return '';
      }
    },
    []
  );

  return (
    <div
      className={cn(
        'flex min-h-[64px] flex-col items-center justify-center overflow-hidden rounded-[10px] px-1.5 transition-all duration-100 bg-black',
        InterFont.className
      )}
    >
      <div
        className={cn('flex w-full flex-col px-1.5', { 'py-2': isExpanded })}
      >
        <div className="flex items-center space-x-2.5">
          <div
            style={{ backgroundColor: `${getBaseColor(type)}1A` }}
            className="flex min-h-8 min-w-8 items-center justify-center rounded-md p-1"
          >
            {renderIcons(type)}
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between">
              <h4
                className={cn(
                  'text-xs leading-[19px] font-semibold text-triad-dark-100 dark:text-white lg:text-base'
                )}
              >
                {title}
              </h4>
              {isDropdown && (
                <button
                  className="flex size-[30px] items-center justify-center rounded-md transition-all hover:bg-black/5 hover:dark:bg-white/5"
                  onClick={toggleExpand}
                >
                  {!isExpanded ? (
                    <IconExpand
                      className="size-7"
                      color={theme === 'dark' ? '#fff' : '#0C131F'}
                    />
                  ) : (
                    <IconClose
                      svgProps={{ className: 'size-5' }}
                      color={theme === 'dark' ? '#fff' : '#0C131F'}
                    />
                  )}
                </button>
              )}
            </div>
            {link && (
              <Link
                className="text-sm font-semibold text-white underline"
                href={link.href}
                target="_blank"
              >
                {link.name}
              </Link>
            )}
          </div>
        </div>

        <div className="mt-2 h-1 w-full rounded-full bg-gray-200 dark:bg-white/10">
          <div
            className="h-1 rounded-full transition-all duration-300 ease-in-out"
            style={{
              width: `${
                manualProgress !== undefined
                  ? manualProgress
                  : 100 - progressValue
              }%`,
              backgroundColor: getBaseColor(type),
            }}
          />
        </div>

        {description && (
          <div
            ref={descRef}
            style={{ height: isExpanded ? descHeight : 0 }}
            className="overflow-hidden transition-all duration-300"
          >
            <div className="mt-1.5">
              <span className="text-bsc-gray-200 block text-[11px] font-medium">
                {description}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
