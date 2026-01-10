import { Tabs } from '@/components/Tabs';
import { Tab, TabList } from '@/components/Tabs/Tab';
import { TabPanel, TabPanels } from '@/components/Tabs/TabPanels';
import { useMarket } from '@/context/Market';
import type { OrderBook } from '@/types/market';
import { cn } from '@/utils/cn';
import { useCallback, useEffect, useMemo, useState } from 'react';
import OrderBookTable from '.';

type TabName = string;

const OrderBookTabs = ({
  orderBook,
  loading,
}: {
  orderBook: OrderBook;
  loading: boolean;
}) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const { selectedMarket } = useMarket();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setIsMobile(windowWidth < 1023);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const tabComponents = useMemo(() => {
    return [
      selectedMarket?.yesSideName || 'Yes',
      selectedMarket?.noSideName || 'No',
    ];
  }, [selectedMarket?.noSideName, selectedMarket?.yesSideName]);

  const renderTab = useCallback(
    (tabName: TabName) => {
      const yesSideName = selectedMarket?.yesSideName || 'Yes';
      const isYesTab = tabName.includes(yesSideName);
      const orders = isYesTab ? orderBook.hype : orderBook.flop;

      return (
        <OrderBookTable
          orderBook={{
            ask: orders.ask,
            bid: orders.bid,
            lastPrice: orders.lastPrice,
            rewardsAvailable: orderBook.rewardsAvailable,
            spreadToReward: orderBook.spreadToReward,
          }}
          lastPrice={orders.lastPrice}
          loading={loading}
        />
      );
    },
    [
      selectedMarket?.yesSideName,
      orderBook.hype,
      orderBook.flop,
      orderBook.rewardsAvailable,
      orderBook.spreadToReward,
      loading,
    ]
  );

  return (
    <div className="flex size-full flex-col py-4 sm:p-4">
      <div className="overflow-hidden transition-[max-height] duration-300 ease-in-out">
        <Tabs
          className="mx-auto w-full max-w-[1540px] pb-0"
          selectedIndex={selectedTab}
          onChange={setSelectedTab}
        >
          <TabList className="mb-0 w-full gap-x-6  lg:px-0">
            {tabComponents.map((tab, index) => (
              <Tab
                className={cn(
                  'flex pb-5 px-0 max-sm:w-full items-center justify-center dark:bg-transparent font-medium h-7 text-sm whitespace-nowrap w-fit'
                )}
                id={index.toString()}
                title={tab}
                key={index}
              />
            ))}
          </TabList>

          <TabPanels className="w-full">
            {tabComponents.map((tab, index) => (
              <TabPanel className="h-fit" key={index}>
                {renderTab(tab)}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderBookTabs;
