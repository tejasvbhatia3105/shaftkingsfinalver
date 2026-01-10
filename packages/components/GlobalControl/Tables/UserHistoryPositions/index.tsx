'use client';

import { Table } from '@/components/Table';
import Tooltip from '@/components/Tooltip';
import { MarketType } from '@/types/market';
import type { Order } from '@/types/market';
import { formatCents } from '@/utils/formatCents';
import { formatTimeAgo } from '@/utils/formatDate';
import { renderPosition } from '@/utils/renderPosition';
import { format } from 'date-fns';
import { useMemo } from 'react';

const UserHistoryTable = ({
  orders,
  loadingHistory,
}: {
  orders: Order[];
  loadingHistory: boolean;
}) => {
  const sortHistory = useMemo(() => {
    return orders.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [orders]);

  const columns = [
    {
      header: (
        <span className="relative ml-auto w-full text-right text-xs text-shaftkings-dark-100 dark:text-[#C0C0C0]">
          Type / Market
        </span>
      ),
      accessor: (row: Order) => {
        const marketData = row.market;

        return (
          <div className=" flex items-center max-[768px]:mr-2">
            {marketData && (
              <img
                className="mr-1 size-8 rounded object-cover lg:mr-4 lg:size-[34px]"
                src={marketData?.pool?.image || marketData.image}
                alt=""
              />
            )}

            <div>
              {marketData && (
                <div className="flex flex-col gap-y-1">
                  <span className="w-fit max-w-[280px] truncate whitespace-nowrap text-[11px] font-medium text-shaftkings-dark-100 dark:text-white lg:text-sm">
                    {marketData?.pool?.name || marketData?.question}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-x-1">
                {renderPosition(row.orderDirection)}

                {marketData.pool?.type === MarketType.POOL && (
                  <p className="max-w-[120px] truncate text-[11px] text-[#C0C0C0]">
                    {marketData?.question}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      },
    },

    {
      header: <span className="ml-auto block text-right">Type</span>,
      accessor: (row: Order) => (
        <div className="ml-auto flex flex-col items-end justify-end text-right">
          <span className="flex justify-end text-xs font-medium text-shaftkings-dark-100 dark:text-white lg:ml-0 lg:text-sm">
            {row.orderSide === 'Ask' ? 'Sell' : 'Buy'}
          </span>
        </div>
      ),
    },
    {
      header: <span className="ml-auto block text-right">Size</span>,
      accessor: (row: Order) => (
        <div className="ml-auto flex flex-col items-end justify-end text-right">
          <div className="flex flex-col items-end">
            <span className="ml-auto block pl-1 text-right text-xs font-medium text-shaftkings-dark-100 dark:text-white lg:text-sm">
              {formatCents(row.price)}
            </span>
            <span className="gap-x-2 text-xs font-medium text-[#C0C0C0]">
              {row.shares.toFixed(2)} Shares
            </span>
          </div>
        </div>
      ),
    },
    {
      header: <span className="ml-auto block text-right">Time Closed</span>,
      accessor: (row: Order) => (
        <Tooltip
          direction="left"
          tooltipMessage={
            row.orderStatus === 'Closed'
              ? `This trade (prediction) was closed on ${format(
                  new Date(row.updatedAt),
                  'yyyy/MM/dd HH:mm:ss'
                )}`
              : ''
          }
          className="ml-auto w-fit"
          styleMessage="dark:bg-shaftkings-dark-250 mt-7 lg:mt-4"
        >
          <span className="flex items-center text-right text-xs font-medium text-shaftkings-dark-100 dark:text-white lg:text-sm">
            {row.orderStatus === 'Closed'
              ? formatTimeAgo(
                  Math.floor(new Date(row.updatedAt).getTime() / 1000)
                )
              : '-'}
          </span>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="max-h-[calc(100%-20px)] overflow-auto lg:overflow-x-hidden">
      {loadingHistory ? (
        <div className="pb-12 lg:pb-20">
          {Array.from({ length: 20 }).map((_, key) => (
            <div
              className="mb-2 h-[52px] w-full animate-pulse rounded-sm bg-black/10 dark:bg-shaftkings-gray-600"
              key={key}
            />
          ))}
        </div>
      ) : (
        <Table
          className={{ tr: 'cursor-default dark:lg:hover:bg-transparent' }}
          data={sortHistory}
          columns={columns}
        />
      )}
      {!loadingHistory && sortHistory.length === 0 && (
        <div className="my-20 text-center text-white/20">
          No History Founded
        </div>
      )}
    </div>
  );
};

export default UserHistoryTable;
