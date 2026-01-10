import { TRD_MINT } from '@/constants/mint';
import type { Order } from '@/types/market';
import { Direction, MarketType } from '@/types/market';
import { cn } from '@/utils/cn';
import { formatCents } from '@/utils/formatCents';
import { formatCurrency, formatValueOfBig } from '@/utils/formatCurrency';
import { truncateToTwoDecimals } from '@/utils/truncateToTwoDecimals';
import { format } from 'date-fns';
import { useMemo } from 'react';

const MarketModalInfo = ({ order }: { order: Order }) => {
  const marketData = order.market;
  const purchased = order.amount;

  const payout = useMemo(() => {
    return order.shares;
  }, [order.shares]);

  return (
    <div className="absolute inset-0 mt-28 flex size-full max-h-[300px] flex-col px-8 md:max-h-[340px] lg:mt-20 lg:px-10">
      <div className="flex items-center gap-x-2.5">
        {(() => {
          const isPool = marketData?.pool;
          const imageUrl = isPool ? marketData.pool?.image : marketData.image;
          const title = isPool ? marketData.pool?.name : marketData.question;
          const altText = title || 'Market Image';

          return (
            <>
              <img
                src={imageUrl}
                alt={altText}
                className="size-7 rounded-[10px] object-cover lg:size-[50px]"
              />
              <div className="flex flex-col gap-y-1">
                <h2 className="font-bold text-shaftkings-dark-100 max-sm:text-sm">
                  {title}
                </h2>
              </div>
            </>
          );
        })()}
      </div>

      <div className="mt-2 flex items-end justify-between border-b border-dashed border-black/15 pb-3 lg:mt-3">
        {marketData?.pool?.type === MarketType.POOL ? (
          <div
            className={cn(
              'text-sm font-semibold flex items-center justify-center text-shaftkings-dark-100 w-fit rounded-md px-2.5 h-7',
              order.orderDirection === Direction.HYPE
                ? 'bg-shaftkings-green-200/20 text-shaftkings-green-200'
                : 'bg-shaftkings-red-200/20 bg-opacity-20 text-shaftkings-red-200'
            )}
          >
            <span className="text-[13px]">{marketData.question}</span>
          </div>
        ) : (
          <div
            className={cn(
              'text-sm font-semibold flex items-center justify-center text-shaftkings-dark-100 w-fit rounded-md px-2.5 h-7',
              order.orderDirection === Direction.HYPE
                ? 'bg-shaftkings-green-200/20 text-shaftkings-green-200'
                : 'bg-shaftkings-red-200/20 bg-opacity-20 text-shaftkings-red-200'
            )}
          >
            <span className="text-[13px]">
              {order.orderDirection === Direction.HYPE ? 'Yes' : 'No'}
            </span>
          </div>
        )}

        <div
          className={cn(
            'text-sm bg-black/5 ml-auto flex items-center justify-center w-fit rounded-md px-2.5 h-7'
          )}
        >
          <span className="text-[13px] font-medium text-shaftkings-gray-400">
            Average Price {formatCents(formatValueOfBig(order.price) || 0)}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div className="flex h-[54px] w-full flex-col font-medium">
          <div className="font-medium text-shaftkings-gray-400">
            <span className={cn('text-sm')}>Prediction Size</span>
          </div>
          <span className="whitespace-nowrap text-xl font-extrabold !leading-[29px] text-shaftkings-dark-100 lg:text-2xl">
            {marketData?.mint === TRD_MINT
              ? formatCurrency(Number(purchased.toFixed(2)))
              : formatCurrency(Number(purchased.toFixed(2)))}
          </span>
        </div>

        <div className="flex h-[54px] w-full flex-col items-end font-medium text-shaftkings-dark-100/60 dark:border-none">
          <div className="h-6 font-medium text-shaftkings-gray-400">
            <span className={cn('text-sm')}>Payout</span>
          </div>
          <span
            className={cn(
              'whitespace-nowrap !leading-[29px] text-shaftkings-green-200 text-xl font-extrabold lg:text-2xl'
            )}
          >
            {marketData?.mint === TRD_MINT
              ? truncateToTwoDecimals(Number(payout)) || 0
              : formatCurrency(truncateToTwoDecimals(Number(payout)) || 0)}{' '}
            {marketData.mint === TRD_MINT ? 'TRD' : ''}
          </span>
        </div>
      </div>

      <span className="mt-3 text-center text-xs font-medium text-shaftkings-gray-400">
        {format(
          new Date(Number(marketData.marketEnd) * 1000),
          'MMMM dd, yyyy - hh:mm a'
        )}
      </span>
    </div>
  );
};

export default MarketModalInfo;

// utils
export const links = [
  {
    icon: '/assets/svg/profile/website.svg',
    label: 'triadmarkets.com',
  },
  {
    icon: '/assets/svg/profile/x.svg',
    label: '@triadFi',
  },
  {
    icon: '/assets/svg/profile/instagram.svg',
    label: '@triadmarkets',
  },
];
