// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-shadow */
import CustomDropdown from '@/components/CustomDropdown';
import RenderWallets from '@/components/RenderWallets';
import { useMarket } from '@/context/Market';
import { MarketType } from '@/types/market';
import type { Holders, MainMarket, Market } from '@/types/market';
import { cn } from '@/utils/cn';
import { useMemo, useState } from 'react';

const HoldersTab = ({
  mainMarket,
  holders,
}: {
  mainMarket: MainMarket;
  holders: {
    hype: Holders[];
    flop: Holders[];
  };
}) => {
  const { selectedMarket } = useMarket();
  const [selectedMarketHolders, setSelectedMarketHolders] =
    useState<Market | null>(null);

  const { hype, flop } = useMemo(() => {
    return {
      hype: holders.hype.sort((a, b) => b.shares - a.shares),
      flop: holders.flop.sort((a, b) => b.shares - a.shares),
    };
  }, [holders]);

  if (!holders?.hype?.length && !holders?.flop?.length) {
    return (
      <div className="my-16 flex w-full items-center justify-center text-sm text-shaftkings-gray-400 dark:text-[#C0C0C0]">
        No holders available for this market.
      </div>
    );
  }

  return (
    <div>
      {mainMarket?.type !== MarketType.SINGLE && (
        <CustomDropdown
          options={[
            ...(mainMarket?.markets ?? []).map((item) => ({
              label: item.question,
              value: item.id,
            })),
          ]}
          defaultValue={selectedMarketHolders?.id || selectedMarket?.id}
          onSelect={(val: string) => {
            const findMarket = mainMarket?.markets.find(
              (item) => item.id === val
            );
            if (!findMarket) return;
            setSelectedMarketHolders(findMarket);
          }}
        />
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-1 text-sm font-medium lg:text-base">
              <span className="mr-0.5 text-black dark:text-white">
                {hype.length}
              </span>
              <h3 className={cn('text-shaftkings-green-200')}>
                {selectedMarket?.yesSideName || 'Yes'}
              </h3>
            </div>
            <span className="text-xs font-medium text-shaftkings-gray-400 dark:text-[#C0C0C0] lg:text-sm">
              Shares
            </span>
          </div>
          <RenderWallets walletsList={hype} type="hype" />
        </div>

        <div className="pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-1 text-sm font-medium lg:text-base">
              <span className="mr-0.5 text-black dark:text-white">
                {flop.length}
              </span>
              <h3 className={cn('text-shaftkings-red-300')}>
                {selectedMarket?.noSideName || 'No'}
              </h3>
            </div>
            <span className="text-xs font-medium text-shaftkings-gray-400 dark:text-[#C0C0C0] lg:text-sm">
              Shares
            </span>
          </div>
          <RenderWallets walletsList={flop} type="flop" />
        </div>
      </div>
    </div>
  );
};

export default HoldersTab;
