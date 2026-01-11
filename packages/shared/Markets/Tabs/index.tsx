'use client';

import type { MainMarket } from '@/types/market';
import Markets from './Markets';

const MarketTabs = ({ initialMarkets }: { initialMarkets: MainMarket[] }) => {
  return (
    <div className="mt-5 px-3 md:px-4 w-full">
      <Markets markets={initialMarkets} />
    </div>
  );
};

export default MarketTabs;
