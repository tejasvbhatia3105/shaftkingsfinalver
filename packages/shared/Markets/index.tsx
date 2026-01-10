'use client';

import { useEffect, useState } from 'react';
import type { MainMarket } from '@/types/market';
import CarouselBanners from './Banners';
import MarketTabs from './Tabs';

const Markets = ({ initialMarkets }: { initialMarkets: MainMarket[] }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setIsMobile(windowWidth < 1280);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  return (
    <div className="relative z-20 w-full">
      <div className="size-full overflow-hidden">
        <CarouselBanners />

        <MarketTabs initialMarkets={initialMarkets} />
      </div>
    </div>
  );
};

export default Markets;
