'use client';

import { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { IconSearchReferrals, IconClose } from '@/components/Icons';
import { Tabs } from '@/components/Tabs';
import { Tab, TabList } from '@/components/Tabs/Tab';
import { TabPanel, TabPanels } from '@/components/Tabs/TabPanels';
import { cn } from '@/utils/cn';
import DateTimePicker from '@/components/DateTimePicker';
import type { ClaimVault } from '@/types/claim';
import api from '@/constants/api';
import { useUser } from '@/context/User';
import MyReferralsTable from './MyReferralsTable';
import type { UserReferred } from '..';
import ClaimVaultsTable from './ClaimVaultsTable';

const UserReferrals = ({
  userReferredData,
}: {
  userReferredData: UserReferred | null;
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [endTimestamp, setEndTimestamp] = useState<number | null>(null);
  const [claimVaults, setClaimVaults] = useState<ClaimVault[]>([]);
  const { wallet } = useUser();
  const isInitialized = useRef(false);
  const tabComponents = ['My Referrals', 'Rewards Claim'];

  const getClaimVaults = useCallback(async (authority: string) => {
    const response = await api.get(`/claim/user/${authority}?q=refer`);
    setClaimVaults(response.data);
  }, []);

  const handleDateChange = useCallback((start: number, end: number) => {
    if (isInitialized.current) {
      setStartTimestamp(start);
      setEndTimestamp(end);
    } else {
      isInitialized.current = true;
    }
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setStartTimestamp(null);
    setEndTimestamp(null);
  }, []);

  const hasActiveFilters =
    searchTerm.trim() || startTimestamp !== null || endTimestamp !== null;

  const filteredData = useMemo(() => {
    if (!userReferredData?.users) return [];

    let filtered = userReferredData.users;

    if (searchTerm.trim()) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (
      startTimestamp !== null &&
      endTimestamp !== null &&
      startTimestamp > 0 &&
      endTimestamp > 0
    ) {
      filtered = filtered.filter((user) => {
        const userDate = new Date(user.registeredAt).getTime() / 1000;
        return userDate >= startTimestamp && userDate <= endTimestamp;
      });
    }

    return filtered.sort((a, b) => b.volume - a.volume);
  }, [userReferredData?.users, searchTerm, startTimestamp, endTimestamp]);

  const renderTab = useCallback(
    (tabName: string) => {
      switch (tabName) {
        case 'My Referrals':
          return (
            <MyReferralsTable
              userReferredData={
                userReferredData
                  ? {
                      users: filteredData,
                      rewards: userReferredData.rewards,
                      total: userReferredData.total,
                      volume: userReferredData.volume,
                    }
                  : null
              }
            />
          );
        case 'Rewards Claim':
          return (
            <ClaimVaultsTable
              claimVaults={claimVaults}
              onRefresh={() =>
                void getClaimVaults(wallet?.publicKey.toString() || '')
              }
            />
          );
        default:
          return null;
      }
    },
    [
      userReferredData,
      filteredData,
      claimVaults,
      getClaimVaults,
      wallet?.publicKey,
    ]
  );

  useEffect(() => {
    if (wallet?.connected) {
      void getClaimVaults(wallet.publicKey.toString());
    }
  }, [wallet?.connected]);

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="px-2.5 lg:px-0">
        <Tabs
          className="mx-auto w-full max-w-[1540px] pb-0"
          selectedIndex={selectedTab}
          onChange={setSelectedTab}
        >
          <div className="flex flex-col items-center justify-between lg:flex-row">
            <TabList className="mb-0 w-full gap-x-6  lg:px-0">
              {tabComponents.map((item, index) => (
                <Tab
                  className={cn(
                    'flex pb-5 px-0 max-sm:w-full items-center justify-center dark:bg-transparent font-medium h-7 text-sm whitespace-nowrap w-fit'
                  )}
                  id={index.toString()}
                  title={item}
                  key={index}
                />
              ))}
            </TabList>
            <div className="my-4 flex w-full items-center gap-x-3 lg:mt-0">
              <div className="relative hidden h-10 lg:flex">
                <span className="absolute left-2 top-[14px] my-auto">
                  <IconSearchReferrals />
                </span>
                <input
                  className="h-10 w-[260px] border border-white/10 bg-white/0 pl-7 pr-8 text-sm text-white placeholder:text-sm placeholder:text-white/30"
                  placeholder="Search name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-[14px] my-auto"
                  >
                    <IconClose color="rgba(255,255,255,0.5)" />
                  </button>
                )}
              </div>
              <div className="">
                <button
                  onClick={() => setShowSearchMobile(!showSearchMobile)}
                  className="flex size-[38px] items-center justify-center bg-white/[0.08]"
                >
                  <IconSearchReferrals />
                </button>
              </div>
              {showSearchMobile ? (
                <div className="relative">
                  <input
                    className="h-10 w-[260px] border border-white/10 bg-white/0 pl-7 pr-8 text-sm text-white placeholder:text-sm placeholder:text-white/30"
                    placeholder="Search name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 top-[14px] my-auto"
                    >
                      <IconClose color="rgba(255,255,255,0.5)" />
                    </button>
                  )}
                </div>
              ) : (
                <DateTimePicker
                  onChange={handleDateChange}
                  startTimestamp={startTimestamp || 0}
                  endTimestamp={endTimestamp || 0}
                />
              )}

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex h-10 items-center gap-x-2 rounded border border-white/10 bg-white/[0.08] px-3 text-xs text-white/70 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mb-4 text-sm text-[#C0C0C0]">
              {filteredData.length === 0 ? (
                <span>No results found</span>
              ) : (
                <span>
                  {filteredData.length} result
                  {filteredData.length !== 1 ? 's' : ''} found
                </span>
              )}
            </div>
          )}

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

export default UserReferrals;
