// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */

'use client';

import {
  IconBasketBall,
  IconMarkets,
  IconPending,
  IconResolved,
} from '@/components/Icons';
import { Tabs } from '@/components/Tabs';
import { Tab, TabList } from '@/components/Tabs/Tab';
import { TabPanel, TabPanels } from '@/components/Tabs/TabPanels';
import { useMarket } from '@/context/Market';
import { cn } from '@/utils/cn';
import { Geoform } from '@/utils/fonts';
import { AnimatePresence } from 'framer-motion';
import { useCallback, useMemo } from 'react';
import type { MainMarket } from '@/types/market';
import { WinningDirection } from '@/types/market';
import { useGlobal } from '@/context/Global';
import Markets from './Markets';

type TabName = 'Games' | 'Markets' | 'Resolved' | 'Pending';

const tabComponents: TabName[] = ['Markets', 'Pending', 'Resolved'];

const MarketTabs = ({ initialMarkets }: { initialMarkets: MainMarket[] }) => {
  const { setSelectedMarket } = useMarket();
  const { setHomeTab, homeTab } = useGlobal();

  const filteredMarkets = useMemo(() => {
    const filtered = initialMarkets.filter((marketResponse) => {
      const isMarketResolved =
        marketResponse.markets &&
        marketResponse.markets.some(
          (item) => item.winningDirection !== WinningDirection.NONE
        );

      const isAllResolved =
        marketResponse.markets &&
        marketResponse.markets.every(
          (item) => item.winningDirection !== WinningDirection.NONE
        );

      const now = new Date().getTime() / 1000;

      const somePending = marketResponse?.markets.some(
        (market) => now > Number(market.marketEnd)
      );

      const isAllPending = marketResponse?.markets.every(
        (market) =>
          market.winningDirection === WinningDirection.NONE &&
          now > Number(market.marketEnd)
      );

      if (homeTab === 0) {
        return !isAllResolved && !isAllPending;
      }

      if (homeTab === 1) {
        return somePending && !isAllResolved;
      }

      if (homeTab === 2) {
        return isMarketResolved;
      }

      return true;
    });

    return filtered;
  }, [homeTab, initialMarkets]);

  const tabIcons = (tab: TabName, index: number) => {
    if (tab === 'Games') {
      return <IconBasketBall isActive={homeTab === index} />;
    }
    if (tab === 'Markets') {
      return <IconMarkets isActive={homeTab === index} />;
    }

    if (tab === 'Pending') {
      return <IconPending isActive={homeTab === index} />;
    }

    return <IconResolved isActive={homeTab === index} />;
  };

  const renderTab = useCallback(() => {
    const filtered = filteredMarkets || [];
    return (
      <div>
        <Markets markets={filtered} />
      </div>
    );
  }, [filteredMarkets]);

  return (
    <div className={cn('mt-5 px-3 md:px-4 w-full', Geoform.className)}>
      <Tabs
        className="flex w-full flex-col justify-start gap-x-6 pb-10 lg:pb-0 xl:flex-row"
        selectedIndex={homeTab}
        onChange={setHomeTab}
      >
        <TabList className="mb-0 flex w-full border-none md:gap-x-6 lg:mt-10 lg:max-w-[220px] lg:px-0 xl:flex-col">
          {tabComponents.map((tab, index) => (
            <Tab
              className={cn(
                'flex h-12 items-center w-full max-sm:justify-center rounded border-none bg-white/5 px-3 space-x-3 dark:bg-transparent font-medium text-sm md:text-base whitespace-nowrap',
                { 'dark:bg-white/5': homeTab === index }
              )}
              id={index.toString()}
              title={tab}
              key={index}
              icon={tabIcons(tab, index)}
              onClick={() => setSelectedMarket(null)}
            />
          ))}
        </TabList>

        <TabPanels className="tab-panels w-full lg:mt-5">
          {tabComponents.map((_, index) => (
            <AnimatePresence key={index}>
              <TabPanel className="h-fit">{renderTab()}</TabPanel>
            </AnimatePresence>
          ))}
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default MarketTabs;
