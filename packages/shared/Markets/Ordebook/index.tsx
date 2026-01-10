import { useMarket } from '@/context/Market';
import type { BookOrder } from '@/types/market';
import { cn } from '@/utils/cn';
import { formatCents } from '@/utils/formatCents';
import { useEffect, useMemo, useState } from 'react';
import { TRD_MINT } from '../../../constants/mint';

function groupOrdersByPrice(orders: BookOrder[]): BookOrder[] {
  const grouped: Record<string, BookOrder> = {};

  for (const order of orders) {
    const priceKey = order.price.toString();

    if (!grouped[priceKey]) {
      grouped[priceKey] = { ...order };
    } else {
      grouped[priceKey].totalShares = String(
        Number(grouped[priceKey].totalShares) + Number(order.totalShares)
      );
    }
  }

  return Object.values(grouped);
}

const OrderBookTable = ({
  lastPrice,
  loading,
  orderBook,
}: {
  lastPrice: number;
  loading: boolean;
  orderBook: {
    ask: BookOrder[];
    bid: BookOrder[];
    lastPrice: number;
    rewardsAvailable: string;
    spreadToReward: string;
  };
}) => {
  const { selectedMarket } = useMarket();
  const [animated, setAnimated] = useState(false);

  const { ask, bid } = useMemo(() => {
    return {
      ask: [...orderBook.ask],
      bid: [...orderBook.bid],
    };
  }, [orderBook]);

  useEffect(() => {
    setAnimated(false);
    const timeout = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timeout);
  }, [ask, bid]);

  const maxShares = Math.max(
    ...ask.map((a) => Number(a.totalShares) / 10 ** 6),
    ...bid.map((b) => Number(b.totalShares) / 10 ** 6),
    1
  );

  const groupedAsks = groupOrdersByPrice(ask);
  const groupedBids = groupOrdersByPrice(bid);

  const sortedAsks = groupedAsks.sort(
    (a, b) => Number(b.price) / 10 ** 6 - Number(a.price) / 10 ** 6
  );

  const sortedBids = groupedBids.sort(
    (a, b) => Number(b.price) / 10 ** 6 - Number(a.price) / 10 ** 6
  );

  const bestAsk =
    sortedAsks.length > 0
      ? Number(sortedAsks[sortedAsks.length - 1].price) / 10 ** 6
      : null;
  const bestBid =
    sortedBids.length > 0 ? Number(sortedBids[0].price) / 10 ** 6 : null;
  const spread = bestAsk !== null && bestBid !== null ? bestAsk - bestBid : 0;

  const renderOrderRow = (order: BookOrder, isAsk: boolean, index: number) => {
    const shares =
      Number(order.totalShares) / 10 ** 6 -
      Number(order.filledShares) / 10 ** 6;

    const total = (Number(order.price) * shares) / 10 ** 6;

    return (
      <div key={index} className="mt-0 flex h-9 items-center  pr-3 lg:pr-0">
        <div className="relative grid w-full grid-cols-4 items-center text-xs font-medium text-white lg:text-sm">
          <div
            className={cn(
              `h-9 transition-all duration-500 ease-out ${
                isAsk ? ' bg-shaftkings-red-300/10' : 'bg-shaftkings-green-200/10'
              }`,
              {
                'w-0': !animated,
              }
            )}
            style={{
              width: animated
                ? `${(Number(order.totalShares) / 10 ** 6 / maxShares) * 25}%`
                : undefined,
            }}
          />

          {loading ? (
            [0, 1, 2].map((idx) => (
              <div
                key={idx}
                className="animate-loading ml-auto h-4 w-20 rounded"
              />
            ))
          ) : (
            <>
              <span
                className={`text-right ${
                  isAsk ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {formatCents(Number(order.price) / 10 ** 6) || 0}
              </span>
              <span className="text-right text-xs text-shaftkings-dark-100 dark:text-white">
                {shares.toFixed(2)}
              </span>
              <span className="text-right text-xs text-shaftkings-dark-100 dark:text-white">
                {selectedMarket?.mint !== TRD_MINT && '$'}
                {Number(total).toFixed(2)}{' '}
                {selectedMarket?.mint === TRD_MINT && 'TRD'}{' '}
              </span>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="size-full rounded-lg">
      <div className="h-full">
        <div className="grid h-10 grid-cols-4 place-content-center border-b border-black/10 px-4 py-2 text-xs text-shaftkings-dark-400 dark:border-white/10 dark:text-shaftkings-dark-150">
          <span></span>
          <span className="text-right">Price</span>
          <span className="text-right">Shares</span>
          <span className="text-right">Total</span>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          <div
            className={cn(
              'relative h-full min-h-[72px] max-h-[200px] overflow-y-auto',
              {
                'flex items-center justify-center': ask.length === 0,
              }
            )}
          >
            <div className="absolute bottom-2 left-4 z-10 rounded bg-[#7F2B30] px-2 py-0.5 text-[10px] text-white md:text-xs">
              Asks
            </div>
            {sortedAsks.length > 0 ? (
              sortedAsks.map((askOrder, idx) =>
                renderOrderRow(askOrder, true, idx)
              )
            ) : (
              <div className="py-4 text-center text-xs text-shaftkings-dark-150 md:text-sm">
                No ask orders available.
              </div>
            )}
          </div>

          <div className="w-full bg-black/5 dark:bg-white/5">
            <div className=" flex w-full items-center justify-between p-2">
              <div className="relative min-w-[30%] text-xs font-medium text-shaftkings-dark-400 dark:text-shaftkings-dark-150 lg:text-sm">
                Last: {formatCents(Number(lastPrice)) || 0}
              </div>
              <div className="relative min-w-[30%] text-xs font-medium text-shaftkings-dark-400 dark:text-shaftkings-dark-150 lg:text-sm">
                Spread: {formatCents(spread)}
              </div>
            </div>
          </div>

          <div
            className={cn(
              'relative h-full min-h-[72px] max-h-[200px] overflow-y-auto',
              {
                'flex items-center justify-center': bid.length === 0,
              }
            )}
          >
            <div className="absolute left-4 top-2 z-10 rounded bg-[#005E3B] px-2 py-0.5 text-[10px] text-white md:text-xs">
              Bids
            </div>
            {sortedBids.length > 0 ? (
              sortedBids.map((bidOrder, idx) =>
                renderOrderRow(bidOrder, false, idx)
              )
            ) : (
              <div className="py-4 text-center text-xs text-shaftkings-dark-150 md:text-sm">
                No bid orders available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBookTable;
