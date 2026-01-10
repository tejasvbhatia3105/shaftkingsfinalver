'use client';

import { Tabs } from '@/components/Tabs';
import { Tab, TabList } from '@/components/Tabs/Tab';
import { TabPanel, TabPanels } from '@/components/Tabs/TabPanels';
import { useMarket } from '@/context/Market';
import { cn } from '@/utils/cn';
import { Geoform, PoppinsFont } from '@/utils/fonts';
import { AnimatePresence } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import { useUser } from '@/context/User';
import {
  WinningDirection,
  type MainMarket,
  type Order,
  type OrderBook,
} from '@/types/market';
import OrderBookTabs from '../Ordebook/Tabs';
import OpenedPositionsTable from '../Tables/MyPredictionsTable';
import BookOrderTable from '../Tables/BookOrderTable';

type TabName = 'Order Book' | 'Positions' | 'Orders';

type InnerMarketTabsProps = {
  mainMarket: MainMarket;
  orders: Order[];
  orderBook: OrderBook;
  loadingOrderBook: boolean;
};

const InnerMarketTabs: React.FC<InnerMarketTabsProps> = ({
  mainMarket,
  orders,
  orderBook,
  loadingOrderBook,
}) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const { selectedMarket } = useMarket();
  const { wallet } = useUser();

  const bookOrders = useMemo(() => {
    const concatBookOrders = [
      ...orderBook.hype.bid,
      ...orderBook.hype.ask,
      ...orderBook.flop.bid,
      ...orderBook.flop.ask,
    ];

    return concatBookOrders.filter(
      (order) =>
        order.authority === wallet?.publicKey?.toBase58() &&
        order.linkedBookOrderId === '61'
    );
  }, [orderBook, wallet]);

  const tabComponents: { title: TabName; count: number }[] = useMemo(() => {
    if (
      selectedMarket?.winningDirection !== WinningDirection.NONE ||
      new Date().getTime() / 1000 > Number(selectedMarket.marketEnd)
    ) {
      return [
        {
          title: 'Positions',
          count: orders.length,
        },
        {
          title: 'Orders',
          count: bookOrders.length,
        },
      ];
    }

    return [
      { title: 'Order Book', count: 0 },
      {
        title: 'Positions',
        count: orders.length,
      },
      {
        title: 'Orders',
        count: bookOrders.length,
      },
    ];
  }, [
    bookOrders.length,
    orders.length,
    selectedMarket?.marketEnd,
    selectedMarket?.winningDirection,
  ]);

  const renderTab = useCallback(
    (tabName: string) => {
      switch (tabName) {
        case 'Order Book':
          return (
            <OrderBookTabs orderBook={orderBook} loading={loadingOrderBook} />
          );
        case 'Positions':
          return (
            <OpenedPositionsTable
              mainMarket={mainMarket}
              orders={orders}
              loading={false}
            />
          );
        case 'Orders':
          return (
            <BookOrderTable
              mainMarket={mainMarket}
              bookOrders={bookOrders}
              loading={false}
            />
          );
        default:
          return null;
      }
    },
    [bookOrders, loadingOrderBook, mainMarket, orderBook, orders]
  );

  return (
    <div
      className={cn(
        'h-full bg-white/90 dark:bg-black w-full',
        Geoform.className
      )}
    >
      <Tabs
        className="mt-0 size-full gap-x-6 pb-10 lg:pb-0"
        selectedIndex={selectedTab}
        onChange={setSelectedTab}
      >
        <TabList className="mb-0 flex w-full gap-x-3 border-none px-4 md:gap-x-4 lg:mt-3 lg:max-w-[220px]">
          {tabComponents.map((tab, index) => (
            <Tab
              className={cn(
                'flex h-12 pb-2 items-center w-fit justify-center px-0 space-x-3 dark:bg-transparent font-medium text-sm whitespace-nowrap text-[#C0C0C0]',
                PoppinsFont.className
              )}
              id={index.toString()}
              title={tab.title}
              key={index}
              count={tab.count}
            />
          ))}
        </TabList>

        <TabPanels
          className={cn(
            'mt-5 w-full h-full min-h-[400px] max-h-[400px] overflow-y-auto'
            // {
            //   'overflow-hidden': filterUserPosition.length <= 0,
            // }
          )}
        >
          {tabComponents.map((tab, index) => (
            <AnimatePresence key={index}>
              <TabPanel className="h-fit">{renderTab(tab.title)}</TabPanel>
            </AnimatePresence>
          ))}
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default InnerMarketTabs;
