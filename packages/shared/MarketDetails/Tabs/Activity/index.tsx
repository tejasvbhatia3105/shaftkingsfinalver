import { useMemo } from 'react';
import Avatar from '@/components/Avatar';
import { IconSpinner } from '@/components/Icons';
import type { Activity, MainMarket } from '@/types/market';
import { Direction, MarketType } from '@/types/market';
import { cn } from '@/utils/cn';
import { formatCents } from '@/utils/formatCents';
import {
  formatCurrency,
  formatNumberToShortScale,
} from '@/utils/formatCurrency';
import { FormatDateAgo } from '@/utils/formatTimeago';
import { isValidPublicKey } from '@/utils/publicKey';
import { truncateWallet } from '@/utils/truncateWallet';
import Image from 'next/image';

interface ActivityProps {
  activity: Activity[];
  isLoading: boolean;
  mainMarket: MainMarket;
}

const ActivityTab = ({ activity, isLoading, mainMarket }: ActivityProps) => {
  const formatShares = (totalShares?: number | null): string => {
    if (!totalShares) return '0.00';

    const scaledValue = Number(totalShares * 10 ** 6);
    const formattedValue = formatNumberToShortScale(scaledValue);

    if (typeof formattedValue === 'number') {
      return (formattedValue as number).toFixed(2);
    }

    if (typeof formattedValue === 'string') {
      return formattedValue;
    }

    return '0.00';
  };

  const isPoolMarket = useMemo(
    () =>
      mainMarket?.type === MarketType.POOL ||
      mainMarket?.type === MarketType.POOL_AGGREGATOR,
    [mainMarket]
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-2">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div
            key={idx}
            className="h-10 w-full animate-pulse rounded bg-gray-700/50"
          ></div>
        ))}
      </div>
    );
  }

  if (!activity.length) {
    return (
      <div className="my-16 flex w-full items-center justify-center text-sm text-shaftkings-gray-400 dark:text-[#C0C0C0]">
        No trades available for this market.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <ul className="flex flex-col divide-y-[1px]">
        {activity.map((trade, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between border-black/5 px-0 py-4 text-sm font-medium first-of-type:border-t-0 first-of-type:pt-0 dark:border-white/5"
          >
            <div className="flex cursor-pointer gap-x-3 max-[768px]:pointer-events-none lg:items-center">
              <button className="flex size-[34px] min-w-[34px] items-center justify-center overflow-hidden rounded-[1px] bg-black/10 dark:bg-white/10">
                {trade?.user?.image?.trim() ? (
                  <Image
                    src={trade.user.image}
                    className="size-[34px] object-cover"
                    alt="avatar"
                    width={34}
                    height={34}
                    unoptimized
                  />
                ) : (
                  <Avatar size={30} seed={trade.authority} hasList={true} />
                )}
              </button>

              <div className="flex flex-col">
                <p className="text-xs font-medium text-shaftkings-dark-100 dark:text-white lg:truncate lg:text-sm">
                  {isValidPublicKey(trade.user.name)
                    ? truncateWallet(trade.user.name, 12)
                    : trade.user.name}{' '}
                  {trade.orderSide === 'Bid' ? 'bought' : 'sold'}{' '}
                  <span
                    className={cn(
                      trade.orderDirection === Direction.HYPE
                        ? 'text-shaftkings-green-200'
                        : 'text-shaftkings-red-200'
                    )}
                  >
                    {trade.orderDirection === Direction.HYPE
                      ? trade.market.yesSideName || 'Yes'
                      : trade.market.noSideName || 'No'}
                  </span>{' '}
                  {isPoolMarket && (
                    <>
                      <img
                        className="inline size-4 object-contain align-text-bottom"
                        src={
                          mainMarket?.type === MarketType.POOL_AGGREGATOR
                            ? trade.market.pool.image
                            : trade.market.image
                        }
                        width={16}
                        height={16}
                        alt=""
                        style={{ display: 'inline', marginRight: 2 }}
                      />
                      {/* {trade.market.question}{' '} */}
                    </>
                  )}
                  at {formatCents(Number(trade.price?.toString()))} USDC
                </p>
                <div className="mt-0.5 text-[13px] font-medium text-shaftkings-gray-400 dark:text-[#C0C0C0]">
                  <span>{formatShares(Number(trade.shares))} Shares</span> (
                  {formatCurrency(
                    Number(Number(trade.shares)) * Number(trade.price)
                  )}
                  )
                </div>
              </div>
            </div>

            <div className="text-end text-[13px] text-shaftkings-gray-400 dark:text-[#C0C0C0]">
              <span>{FormatDateAgo(trade.createdAt)}</span>
            </div>
          </li>
        ))}
      </ul>
      {isLoading && (
        <div className="w-full">
          <div className="mx-auto flex w-fit items-center gap-x-2 dark:text-white">
            Loading
            <IconSpinner />
          </div>
        </div>
      )}

      {/* <Pagination
        page={marketTradeHistoryPage}
        totalPages={totalHistoryPages}
        onPageChange={setMarketTradeHistoryPage}
      /> */}
    </div>
  );
};

export default ActivityTab;
