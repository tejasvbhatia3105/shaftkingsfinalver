'use client';

import { Tabs } from '@/components/Tabs';
import { Tab, TabList } from '@/components/Tabs/Tab';
import { TabPanel, TabPanels } from '@/components/Tabs/TabPanels';
import { type Holders, type MainMarket, type Activity } from '@/types/market';
import { cn } from '@/utils/cn';
import { useCallback, useState } from 'react';
import { useMarket } from '@/context/Market';
import ActivityTab from './Activity';
import HoldersTab from './Holders';

type TabName = 'Activity' | 'Holders';

const tabComponents: TabName[] = ['Activity', 'Holders'];

const MarketDetailsTabs = ({
  mainMarket,
  activity,
  isLoadingActivity,
  holders,
}: {
  mainMarket: MainMarket;
  activity: Activity[];
  isLoadingActivity: boolean;
  holders: {
    hype: Holders[];
    flop: Holders[];
  };
}) => {
  const { selectedMarket } = useMarket();
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const renderTab = useCallback(
    (tabName: TabName) => {
      switch (tabName) {
        case 'Activity':
          return (
            <ActivityTab
              activity={activity.filter((item) => {
                return (
                  new Date(item.createdAt).getTime() / 1000 <
                  Number(selectedMarket?.marketEnd)
                );
              })}
              isLoading={isLoadingActivity}
              mainMarket={mainMarket}
            />
          );
        case 'Holders':
          return <HoldersTab mainMarket={mainMarket} holders={holders} />;
        default:
          return null;
      }
    },
    [
      activity,
      holders,
      isLoadingActivity,
      mainMarket,
      selectedMarket?.marketEnd,
    ]
  );

  return (
    <>
      <Tabs
        className="mx-auto w-full max-w-[1540px] pb-10 lg:pb-0"
        selectedIndex={selectedTab}
        onChange={setSelectedTab}
      >
        <TabList className="mx-auto mb-0 w-full gap-x-6 lg:px-0">
          {tabComponents.map((tab, index) => (
            <Tab
              className={cn(
                'flex pb-5 px-0 items-center justify-center dark:bg-transparent font-medium h-7 text-base whitespace-nowrap w-fit'
              )}
              id={index.toString()}
              title={tab}
              key={index}
            />
          ))}
        </TabList>

        <TabPanels className="mt-5 w-full lg:pb-20">
          {tabComponents.map((tab, index) => (
            <TabPanel className="h-fit" key={index}>
              {renderTab(tab)}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default MarketDetailsTabs;
