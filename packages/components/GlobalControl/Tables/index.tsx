'use client';

import { Tabs } from '@/components/Tabs';
import { Tab, TabList } from '@/components/Tabs/Tab';
import { TabPanel, TabPanels } from '@/components/Tabs/TabPanels';
import { cn } from '@/utils/cn';
import { useCallback, useMemo } from 'react';
import type { BookOrder, Order } from '@/types/market';
import BookOrderTable from '@/shared/Markets/Tables/BookOrderTable';
import UserOpenedPositions from './UserOpenedPositions';
import UserHistoryTable from './UserHistoryPositions';

type UserTabsProps = {
  orders: Order[];
  loadingOrders: boolean;
  pageWallet: string;
  limitOrders: BookOrder[];
};

const UserTables = ({
  orders,
  loadingOrders,
  pageWallet,
  limitOrders,
}: UserTabsProps) => {
  const history = useMemo(() => {
    return orders.filter((item) => item.orderStatus !== 'Open');
  }, [orders]);

  const openOrders = useMemo(() => {
    return orders.filter((item) => item.orderStatus === 'Open');
  }, [orders]);

  const renderTab = useCallback(
    (tabName: string) => {
      switch (tabName) {
        case 'Positions':
          return (
            <UserOpenedPositions
              orders={openOrders}
              loading={loadingOrders}
              pageWallet={pageWallet}
            />
          );
        case 'Limit Orders':
          return (
            <BookOrderTable
              bookOrders={limitOrders}
              loading={loadingOrders}
              mainMarket={null}
            />
          );
        case 'Trade History':
          return (
            <UserHistoryTable orders={history} loadingHistory={loadingOrders} />
          );
        default:
          return null;
      }
    },
    [loadingOrders, openOrders, history, pageWallet, limitOrders]
  );

  const tabComponents: { title: string; count?: number }[] = useMemo(
    () => [
      {
        title: 'Positions',
        count: openOrders.length,
      },
      {
        title: 'Limit Orders',
        count: limitOrders.length,
      },
      {
        title: 'Trade History',
      },
    ],
    [limitOrders.length, openOrders.length]
  );

  return (
    <Tabs className="h-full lg:mt-6" variant="tertiary">
      <TabList className="mx-auto mb-0 mt-[6px] w-full rounded-none border-x-0 border-y border-shaftkings-gray-1000 dark:border-white/5 dark:bg-transparent">
        {tabComponents.map((tab, index) => (
          <Tab
            className={cn(
              'flex w-full items-center border-none justify-center max-[648px]:flex-1 max-[648px]:justify-center lg:max-w-[180px]'
            )}
            id={index.toString()}
            title={tab.title}
            key={index}
            count={tab.count}
          />
        ))}
      </TabList>

      <TabPanels className="size-full">
        {tabComponents.map((tab, index) => (
          <TabPanel className="h-full p-0" key={index}>
            {renderTab(tab.title)}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default UserTables;
