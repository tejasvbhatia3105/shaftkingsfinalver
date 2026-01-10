// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */
import { Button } from '@/components/Button';
import { useMarket } from '@/context/Market';
import MarketCard from '@/shared/Markets/MarketCard';
import type { MainMarket, VolumeLeaders } from '@/types/market';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const MarketsGrid: React.FC<{
  markets: MainMarket[];
  emptyPhrase?: string;
  activeFilter: string;
  volumeLeaders: VolumeLeaders;
}> = ({ markets, emptyPhrase, activeFilter }) => {
  const { currentMarketType } = useMarket();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setIsMobile(windowWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const renderMarketCards = (marketsList: MainMarket[]) => {
    return marketsList.map((market, idx) => {
      const sortedAggregates = [...market.markets].sort(
        (a, b) => Number(b.hypeLiquidity ?? 0) - Number(a.hypeLiquidity ?? 0)
      );

      return (
        <MarketCard
          key={idx}
          market={sortedAggregates[0]}
          data={{
            ...market,
          }}
          agregattes={sortedAggregates}
        />
      );
    });
  };

  const renderTrendingLayout = () => {
    // const itemsForThreeRows = Math.ceil((itemsPerRow * 3) / 3) * 3;
    // const firstThreeRows = markets.slice(0, itemsForThreeRows);
    // const remainingMarkets = markets.slice(itemsForThreeRows);

    const tradingSection = <div className="w-full overflow-x-auto"></div>;

    return (
      <div className="flex w-full flex-col gap-3.5 overflow-x-auto">
        <div className="relative grid max-h-[700px] w-full grid-cols-[repeat(auto-fill,_minmax(328px,_1fr))] gap-3.5 overflow-x-auto overflow-y-hidden">
          {renderMarketCards(markets)}
          <div className="absolute bottom-0 flex h-[205px] w-full items-end justify-center bg-gradient-to-b from-white/0 to-white dark:from-shaftkings-dark-400/0 dark:to-shaftkings-dark-400">
            <Button
              className="h-10 rounded px-4 text-sm font-medium leading-4"
              onClick={() => router.push('/?category=all')}
              color="blue"
              variant="contained"
              size="large"
            >
              View all Markets
            </Button>
          </div>
        </div>

        {tradingSection}
      </div>
    );
  };

  const renderDefaultLayout = () => (
    <div className="grid w-full grid-cols-[repeat(auto-fill,_minmax(328px,_1fr))] gap-3.5">
      {renderMarketCards(markets)}
    </div>
  );

  return (
    <motion.div
      ref={containerRef}
      className="mt-3 w-full overflow-hidden px-2.5 lg:px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={activeFilter}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div
        className={`grid gap-3.5  ${markets.length === 0 ? 'grid-cols-1' : ''}`}
      >
        {markets.length > 0 ? (
          activeFilter === 'Trending' && currentMarketType === 'explore' ? (
            renderTrendingLayout()
          ) : (
            renderDefaultLayout()
          )
        ) : (
          <div className="col-span-full my-24 flex w-full items-center justify-center text-center text-sm text-shaftkings-dark-100/80 dark:text-[#C0C0C0] lg:text-base">
            <span>{emptyPhrase}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MarketsGrid;
