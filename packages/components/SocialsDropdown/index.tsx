'use client';

import { cn } from '@/utils/cn';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { IconArrowLinearRight } from '../Icons';

export type SocialData = {
  title: string;
  description: string;
  href: string;
  icon?: ReactNode;
};

export type SocialsDropDownProps = {
  data: SocialData[];
};

export function SocialsDropDown({ data }: SocialsDropDownProps) {
  return (
    <div
      style={{ zIndex: 1000 }}
      className={cn(
        'grid grid-rows-1 border bg-cover mt-3 bg-white/90 dark:bg-black/25 backdrop-blur-3xl border-black/20 dark:border-shaftkings-dark-200 shadow-lg px-0 absolute w-[260px] left-0 top-full animate-fade-down animate-duration-300 animate-ease-out rounded-[1px]'
      )}
    >
      {data.map((social, index) => (
        <Link
          href={social.href}
          key={index}
          target="_blank"
          className="group flex items-center justify-between px-4 py-2 dark:hover:bg-white/5"
        >
          <div className="flex grow">
            <div className="mr-3 mt-1">{social.icon ? social.icon : null}</div>

            <div className="flex flex-col">
              <span className="text-xs font-medium dark:text-white">
                {social.title}
              </span>
              <span className="text-xs text-shaftkings-gray-600 dark:text-[#C0C0C0]">
                {social.description}
              </span>
            </div>
          </div>

          <IconArrowLinearRight
            className={cn(
              'size-[18px] transition-colors',
              'text-black dark:text-white opacity-40 group-hover:opacity-100'
            )}
            color="currentColor"
          />
        </Link>
      ))}
    </div>
  );
}
