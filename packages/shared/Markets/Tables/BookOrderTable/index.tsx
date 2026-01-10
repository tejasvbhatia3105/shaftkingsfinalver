'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Direction } from '@/types/market';
import type { BookOrder, MainMarket } from '@/types/market';

import { formatCurrency } from '@/utils/formatCurrency';

import { Button } from '@/components/Button';
import Tooltip from '@/components/Tooltip';
import { useGlobal } from '@/context/Global';
import { useMarket } from '@/context/Market';
import { cn } from '@/utils/cn';
import { truncateText } from '@/utils/truncateWallet';
import { Table } from '@/components/Table';
import { formatCents } from '@/utils/formatCents';
import { USDC_MINT } from '@/constants/mint';
import { OrderDirection } from '@triadxyz/triad-protocol';

const BookOrderTable = ({
  bookOrders,
  loading,
}: {
  bookOrders: BookOrder[];
  tickerAddress?: string;
  loading?: boolean;
  mainMarket: MainMarket | null;
}) => {
  const {
    loadingClaimOrderPosition,
    loadingClosePositionIndex,
    openClaimModal,
    modalSharePosition,
    cancelOrder,
    selectedMarket,
  } = useMarket();
  const { setIsModalOpen } = useGlobal();
  const pathname = usePathname();

  useEffect(() => {
    setIsModalOpen(openClaimModal);
    setIsModalOpen(modalSharePosition);
  }, [modalSharePosition, openClaimModal, setIsModalOpen]);

  const getMarketImage = useCallback(
    (row: BookOrder) => {
      if (row.market?.pool?.image || row.market?.image) {
        return row.market?.pool?.image || row.market?.image;
      }

      return selectedMarket?.image;
    },
    [selectedMarket?.image]
  );

  const getLabelText = (
    row: BookOrder,
    {
      yesSideName,
      noSideName,
    }: {
      yesSideName: string;
      noSideName: string;
    }
  ) => {
    if (row.market?.pool) {
      return row.market?.question;
    }

    return row.orderDirection === OrderDirection.HYPE
      ? yesSideName
      : noSideName;
  };

  const columns = useMemo(
    () => [
      {
        header: 'Market / Type',
        accessor: (row: BookOrder) => {
          const commonClasses =
            'flex w-fit h-[18px] min-w-9 items-center justify-center gap-x-0.5 rounded-[2px] px-1 text-[11px] font-medium rounded-[2px]';
          const green = 'bg-shaftkings-green-200/10 text-shaftkings-green-200';
          const red = 'bg-shaftkings-red-200 bg-opacity-10 text-shaftkings-red-300';

          const image = getMarketImage(row);

          return (
            <div className="flex items-center">
              {image && (
                <div className="relative">
                  <img
                    className="mr-0.5 size-7 min-h-7 min-w-7 rounded-full object-cover lg:mr-2 lg:size-[34px] lg:rounded"
                    src={image}
                    alt=""
                  />
                </div>
              )}

              <div className="ml-0.5">
                {(selectedMarket || row.market) &&
                  !pathname.includes('/market') && (
                    <span className="w-fit whitespace-nowrap text-[11px] font-medium text-shaftkings-dark-100 dark:text-white lg:text-sm">
                      {truncateText(
                        row.market?.pool?.name || row.market?.question || '',
                        30
                      )}
                    </span>
                  )}

                <div
                  className={cn(
                    commonClasses,
                    row.orderDirection === Direction.HYPE.toLowerCase()
                      ? green
                      : red
                  )}
                >
                  {getLabelText(row, {
                    yesSideName:
                      row.market?.yesSideName ||
                      selectedMarket?.yesSideName ||
                      'Yes',
                    noSideName:
                      row.market?.noSideName ||
                      selectedMarket?.noSideName ||
                      'No',
                  })}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        header: 'Oder Side',
        accessor: (row: BookOrder) => {
          const commonClasses =
            'flex w-fit h-[18px] min-w-9 items-center justify-center gap-x-0.5 rounded-[2px] px-1 text-[11px] font-medium rounded-[2px]';
          const green = 'bg-shaftkings-green-200/10 text-shaftkings-green-200';
          const red = 'bg-shaftkings-red-200 bg-opacity-10 text-shaftkings-red-300';

          return (
            <div>
              {row.orderSide === 'bid' ? (
                <span className={cn(commonClasses, green)}>
                  {row.orderSide === 'bid' ? 'Buy' : 'Sell'}
                </span>
              ) : (
                <span className={cn(commonClasses, red)}>Sell</span>
              )}
            </div>
          );
        },
      },
      {
        header: (
          <Tooltip
            className="relative bottom-[3px] ml-auto w-fit border-b border-dashed border-shaftkings-gray-400 pb-0"
            direction="bottom"
            styleMessage="dark:bg-shaftkings-dark-250"
            tooltipMessage="The price at which a trade position is opened. It serves as a reference for calculating profit or loss as the asset’s price changes."
          >
            <span className="relative top-1">Entry Price</span>
          </Tooltip>
        ),
        accessor: (row: BookOrder) => (
          <span className="block text-right text-sm font-medium text-shaftkings-dark-100 dark:text-white lg:pl-0 lg:text-sm lg:leading-4">
            {formatCents(Number(row.price) / 10 ** 6)}
          </span>
        ),
      },
      {
        header: (
          <Tooltip
            className="relative bottom-[3px] ml-auto w-fit border-b border-dashed border-shaftkings-gray-400"
            direction="bottom"
            styleMessage="dark:bg-shaftkings-dark-250"
            tooltipMessage="The total amount spent to acquire an asset in a trade"
          >
            <span className="relative top-1">Size</span>
          </Tooltip>
        ),
        accessor: (row: BookOrder) => {
          const shares = Number(row.totalShares) / 10 ** 6;
          const price = Number(row.price) / 10 ** 6;
          const totalAmount = shares * price;
          const marketData = selectedMarket || row.market;

          return (
            <div className="ml-auto flex flex-col items-end justify-end text-right">
              <span className="flex justify-end text-xs font-medium text-shaftkings-dark-100 dark:text-white lg:ml-0 lg:text-sm">
                {Number(shares).toFixed(2)}{' '}
                {Math.floor(shares) === 1 ? 'Share' : 'Shares'}
              </span>

              <div className="flex flex-col items-end gap-x-1 text-shaftkings-gray-400 dark:text-[#C0C0C0] lg:flex-row lg:items-center">
                <span className="gap-x-2 whitespace-nowrap text-xs font-medium">
                  {formatCurrency(totalAmount)}{' '}
                  {marketData?.mint === USDC_MINT ? '' : 'TRD'}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        header: 'Filled Shares / Total Shares',
        accessor: (row: BookOrder) => {
          return (
            <div className="flex items-center justify-start text-left text-white">
              {(Number(row.filledShares) / 10 ** 6).toFixed(1)} /{' '}
              {(Number(row.totalShares) / 10 ** 6).toFixed(1)}
            </div>
          );
        },
      },

      {
        header: (
          <div className="ml-auto w-fit text-end">
            <span>Action</span>
          </div>
        ),
        accessor: (row: BookOrder, index: number) => {
          const buttonProps = {
            className: cn(
              'px-1 py-2 rounded-[1px] ml-auto min-w-[130px] text-xs',
              'bg-shaftkings-red-300 hover:bg-shaftkings-red-300/80 dark:bg-shaftkings-red-300/10 dark:hover:bg-shaftkings-red-300/40 text-white dark:text-shaftkings-red-300'
            ),
            color: 'tertiary' as const,
            disabled:
              loadingClosePositionIndex === index ||
              loadingClaimOrderPosition === index,
          };

          return (
            <Button
              {...buttonProps}
              loading={loadingClosePositionIndex === index}
              onClick={() => {
                void cancelOrder({
                  order: row,
                  index,
                });
              }}
            >
              <span className="leading-[13px]"> Cancel Order</span>
            </Button>
          );
        },
      },
    ],
    [
      selectedMarket,
      getMarketImage,
      pathname,
      loadingClosePositionIndex,
      loadingClaimOrderPosition,
      cancelOrder,
    ]
  );

  return (
    <div className={cn('w-full rounded-lg pb-1 lg:pb-0 overflow-x-auto')}>
      {loading ? (
        <div className="min-h-[290px] w-full px-4">
          {Array.from({ length: 4 }).map((_, key) => (
            <div
              className="mb-2 h-[52px] w-full animate-pulse rounded-sm bg-black/10 dark:bg-shaftkings-gray-600"
              key={key}
            />
          ))}
        </div>
      ) : bookOrders.length === 0 ? (
        <div className="flex min-h-[290px] flex-col items-center justify-center py-8 text-center">
          <p className="text-sm font-medium text-shaftkings-dark-100 dark:text-white lg:text-lg">
            No orders found for this market
          </p>
          <p className="mt-2 text-xs text-shaftkings-gray-600 dark:text-[#C0C0C0] lg:text-sm">
            You don’t have any open orders at the moment
          </p>
        </div>
      ) : (
        <Table
          odd
          data={bookOrders}
          columns={columns}
          className={{
            tbody: 'space-y-3 border-none',
            th: 'border-t-0 lg:px-3',
            thead: 'border-t-0 lg:px-3',
            td: 'lg:px-3',
            tr: 'cursor-default dark:lg:hover:bg-transparent dark:lg:odd:hover:bg-transparent dark:lg:even:hover:bg-transparent',
          }}
        />
      )}

      {/* {openClaimModal && selectedPosition && (
        <ClaimModal
          position={selectedPosition}
          openModal={true}
          onCloseModal={() => setOpenClaimModal(false)}
        />
      )}

      {selectedPosition && openModalPnlAfterClosePosition && (
        <ClaimModal
          position={selectedPosition}
          openModal={true}
          onCloseModal={handleCloseModal}
          hiddenClaim={true}
        />
      )} */}
    </div>
  );
};

export default BookOrderTable;
