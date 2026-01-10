'use client';

import { useGlobal } from '@/context/Global';
import { cn } from '@/utils/cn';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

const AsideControl: React.FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [shouldRender, setShouldRender] = useState(true);
  const { rulesModalOpen } = useGlobal();

  useEffect(() => {
    if (
      rulesModalOpen ||
      (pathname !== '/' &&
        !pathname.includes('?category') &&
        !pathname.includes('/market'))
    ) {
      setShouldRender(false);
    } else {
      setShouldRender(true);
    }
  }, [rulesModalOpen, pathname]);

  if (!shouldRender) {
    return null;
  }

  return (
    <aside
      className={cn(
        'fixed right-0 top-0 h-[100vh] hidden xl:block w-full max-w-[50px] border border-shaftkings-gray-1000 border-t-0 dark:border-white/5 z-[25]',
        pathname.includes('category') || pathname === '/'
          ? 'top-[52px]'
          : 'top-[50px]'
      )}
    >
      <div className="relative flex w-full flex-col items-center px-4 py-2.5">
        {children}
      </div>
    </aside>
  );
};

export default AsideControl;
