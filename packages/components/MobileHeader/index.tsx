'use client';

import { useGlobal } from '@/context/Global';
import { useMarket } from '@/context/Market';
import { cn } from '@/utils/cn';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useUser } from '@/context/User';
import { IconDashBoardSecondary, IconHome } from '../Icons';

export const MobileHeader: React.FC = () => {
  const pathname = usePathname();
  const { isModalOpen } = useGlobal();
  const { wallet } = useUser();
  const { openMobileDeposit } = useMarket();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsSubmenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [containerRef]);

  const verifyRoutes = useMemo(() => {
    switch (pathname) {
      case '/':
      case '/market':
        return 'trade';
      case `/profile/${wallet?.publicKey?.toBase58()}`:
        return 'portFolio';
      default:
        return 'trade';
    }
  }, [pathname, wallet?.publicKey]);

  const handleGetColor = useCallback(
    (route: string) => {
      if (verifyRoutes === route) {
        return theme === 'light' ? '#000' : '#fff';
      }
      return '#A1A7BB';
    },
    [verifyRoutes, theme]
  );

  const dataRoutes = useMemo(() => {
    return [
      {
        title: 'Markets',
        href: '/',
        current: 'trade',
        icon: <IconHome color={handleGetColor('trade')} />,
      },
      {
        title: 'PortFolio',
        subtitle: '',
        href: wallet?.publicKey
          ? `/profile/${wallet?.publicKey?.toBase58()}`
          : '/',
        current: 'portFolio',
        icon: <IconDashBoardSecondary color={handleGetColor('portFolio')} />,
      },
    ];
  }, [handleGetColor, wallet?.publicKey]);

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          'fixed left-0 z-[25] bottom-0 py-2 px-2.5 flex w-full items-center h-[60px] justify-center bg-gray-200 dark:bg-[#13141A80] border border-white/10 backdrop-blur-xl xl:hidden',
          {
            hidden:
              pathname === '/discover' ||
              openMobileDeposit ||
              pathname === '/referral',
            'z-0': isModalOpen,
          }
        )}
      >
        {dataRoutes.map((item, index) => (
          <div key={index} className="relative w-full flex-1">
            <Link
              className={cn(
                'flex flex-col sm:flex-row items-center justify-center h-[50px] sm:h-[40px] border-transparent rounded-[1px] py-2',
                {
                  'opacity-50': !wallet?.publicKey && index === 2,
                }
              )}
              href={item.href}
              onClick={(e) => {
                if (item.title === 'More') {
                  e.preventDefault();
                  setIsSubmenuOpen((prev) => !prev);
                }
              }}
            >
              <div className="flex size-[30px] min-h-[22px] items-center justify-center rounded-[1px]">
                {item.icon}
              </div>
              <div className="mt-0.5 flex flex-col">
                <span
                  className={cn('font-medium text-[11px]', {
                    'text-shaftkings-dark-100 dark:text-white':
                      verifyRoutes === item.current ||
                      (item.title === 'More' && isSubmenuOpen),
                    'text-[#C0C0C0]':
                      verifyRoutes !== item.current &&
                      !(item.title === 'More' && isSubmenuOpen),
                  })}
                >
                  {item.title}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};
