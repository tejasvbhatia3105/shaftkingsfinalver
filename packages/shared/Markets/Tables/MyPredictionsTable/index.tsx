'use client';

import { Table } from '@/components/Table';
import { Direction, WinningDirection } from '@/types/market';
import type { MainMarket, Order } from '@/types/market';

import { formatCurrency } from '@/utils/formatCurrency';
import { useCallback, useEffect, useMemo } from 'react';

import { Button } from '@/components/Button';
import Tooltip from '@/components/Tooltip';
import { useGlobal } from '@/context/Global';
import { useMarket } from '@/context/Market';
import { cn } from '@/utils/cn';
import { truncateToTwoDecimals } from '@/utils/truncateToTwoDecimals';
import { truncateText } from '@/utils/truncateWallet';
import { getTeamFullName } from '@/utils/getTeamFullName';
import { formatCents } from '@/utils/formatCents';
import calculatePnl from '@/utils/calculatePnl';
import { marketEnded } from '@/utils/helpers';
import { PublicKey } from '@solana/web3.js';

const MyPredictionsTable = ({
  orders,
  loading,
  mainMarket,
}: {
  orders: Order[];
  mainMarket: MainMarket;
  loading: boolean;
}) => {
  const {
    loadingClaimOrderPosition,
    loadingClosePositionIndex,
    claimPayoutOrder,
    openModalPnlAfterClosePosition,
    openClaimModal,
  } = useMarket();
  const { setIsModalOpen } = useGlobal();

  const handleClaimClick = useCallback(
    async (order: Order) => {
      const marketId = Number(order?.marketId);

      const isWinner =
        order.orderDirection ===
          (order.market.winningDirection as 'Hype' | 'Flop') ||
        (order.market.winningDirection as WinningDirection) ===
          WinningDirection.DRAW;

      if (!order.market?.mint) return;

      if (isWinner) {
        await claimPayoutOrder([
          {
            marketId,
            orderId: Number(order.orderId),
            userNonce: Number(order.userNonce),
            mint: new PublicKey(order.market?.mint),
            isTrdPayout: order.isTrdPayout,
            shares: order.shares,
            orderDirection: order.orderDirection,
          },
        ]);
      } else {
        await claimPayoutOrder([
          {
            marketId,
            orderId: Number(order.orderId),
            userNonce: Number(order.userNonce),
            mint: new PublicKey(order.market?.mint),
            isTrdPayout: order.isTrdPayout,
            shares: order.shares,
            orderDirection: order.orderDirection,
          },
        ]);
      }
    },
    [claimPayoutOrder]
  );

  useEffect(() => {
    setIsModalOpen(openClaimModal);
    setIsModalOpen(openModalPnlAfterClosePosition);
  }, [openClaimModal, openModalPnlAfterClosePosition, setIsModalOpen]);

  const calculateClosePayout = (row: Order, isMarketEnd: boolean) => {
    if (!row.market) return 0;

    const direction = row.market.winningDirection;

    const isWinner = String(row.orderDirection) === String(direction);

    if (direction === WinningDirection.DRAW) {
      return row.shares * 0.5;
    }

    if (!isWinner && isMarketEnd) {
      return -row.amount;
    }

    return row.shares;
  };

  const payoutFee = useMemo(() => {
    return mainMarket?.markets?.[0]?.payoutFee || 0;
  }, [mainMarket]);

  const columns = useMemo(
    () => [
      {
        header: 'Market / Type',
        accessor: (row: Order) => {
          const marketData = row.market;

          const currentDirectionName =
            row.orderDirection === Direction.HYPE
              ? marketData?.yesSideName
              : marketData?.noSideName;

          return (
            <div className="flex items-center">
              <img src={marketData?.image} className="size-10 " alt="" />

              <div className="ml-2">
                {currentDirectionName && (
                  <span className="w-fit whitespace-nowrap text-[11px] font-medium text-shaftkings-dark-100 dark:text-white lg:text-sm">
                    {truncateText(getTeamFullName(currentDirectionName), 38)}
                  </span>
                )}
              </div>
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
        accessor: (row: Order) => (
          <span className="block text-right text-sm font-medium text-shaftkings-dark-100 dark:text-white lg:pl-0 lg:text-sm lg:leading-4">
            {formatCents(row.price)}
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
        accessor: (row: Order) => {
          const shares = Number(row.shares);

          return (
            <div className="ml-auto flex flex-col items-end justify-end text-right">
              <span className="flex justify-end text-xs font-medium text-shaftkings-dark-100 dark:text-white lg:ml-0 lg:text-sm">
                {shares.toFixed(2)}{' '}
                {Math.floor(shares) === 1 ? 'Share' : 'Shares'}
              </span>

              <div className="flex flex-col items-end gap-x-1 text-shaftkings-gray-400 dark:text-[#C0C0C0] lg:flex-row lg:items-center">
                <span className="gap-x-2 whitespace-nowrap text-xs font-medium">
                  {formatCurrency(Number(row.amount))}{' '}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        header: (
          <Tooltip
            className={cn(
              'relative bottom-[3px] ml-auto mr-5 w-fit border-b border-dashed border-shaftkings-gray-400'
            )}
            direction="bottom"
            tooltipMessage="The reward is based on the shares you purchased and market liquidity. When you buy, the system calculates your reward by factoring in how your purchase affects the price, based on remaining shares and liquidity."
          >
            <span className="relative top-1">Pnl</span>
          </Tooltip>
        ),
        accessor: (row: Order) => {
          const marketData = row.market;
          const isQuestionEnded = marketData ? marketEnded(marketData) : false;

          if (isQuestionEnded) {
            return (
              <div className="relative right-5 flex items-center justify-end">
                -
              </div>
            );
          }

          const pnl = calculatePnl(
            {
              hypeLiquidity: marketData?.hypeLiquidity || '0',
              hypePrice: marketData?.hypePrice || '0',
              flopLiquidity: marketData?.flopLiquidity || '0',
              flopPrice: marketData?.flopPrice || '0',
            },
            row
          );

          return (
            <div
              className={cn(
                'ml-auto w-fit text-right whitespace-nowrap animate-pulse duration-75 ease-in',
                pnl > 0 ? 'text-shaftkings-green-200' : 'text-shaftkings-red-300'
              )}
            >
              <div className="flex items-center gap-x-1">
                <div>
                  <span className="text-sm font-medium">
                    ${truncateToTwoDecimals(pnl)}
                  </span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        header: (
          <Tooltip
            className="relative bottom-[3px] ml-auto w-fit border-b border-dashed border-shaftkings-gray-400 pb-0.5"
            direction="bottom"
            styleMessage="dark:bg-shaftkings-dark-250"
            tooltipMessage={
              <div className="flex-col gap-y-2">
                {`Shares = 1 : 1 but a ${Number(
                  payoutFee ? Number(payoutFee) / 100 : 0
                )}% fee must be applied for each market`}
              </div>
            }
          >
            <span className="relative top-1">Payout</span>
          </Tooltip>
        ),
        accessor: (row: Order) => {
          const marketData = row.market;
          const isQuestionEnded = marketData ? marketEnded(marketData) : false;

          const shouldClosePayout =
            isQuestionEnded &&
            marketData?.winningDirection !== WinningDirection.NONE;

          const currentPayout = calculateClosePayout(row, shouldClosePayout);

          return (
            <div
              className={cn(
                'ml-auto w-fit text-right whitespace-nowrap',
                currentPayout > 0
                  ? 'text-shaftkings-green-200'
                  : 'text-shaftkings-red-300'
              )}
            >
              <span className="text-sm font-medium">
                {formatCurrency(currentPayout)}
              </span>
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
        accessor: (row: Order, index: number) => {
          const marketData = row.market;
          const isQuestionEnded = marketData ? marketEnded(marketData) : false;

          const getButtonText = () => {
            if (!isQuestionEnded) return 'Close Position';

            return (marketData?.winningDirection as 'Hype' | 'Flop') ===
              row.orderDirection ||
              (marketData?.winningDirection as WinningDirection) ===
                WinningDirection.DRAW
              ? 'Claim'
              : 'Close Prediction';
          };

          const pnl = calculatePnl(
            {
              hypeLiquidity: marketData?.hypeLiquidity || '0',
              hypePrice: marketData?.hypePrice || '0',
              flopLiquidity: marketData?.flopLiquidity || '0',
              flopPrice: marketData?.flopPrice || '0',
            },
            row
          );

          const getButtonClass = () => {
            if (getButtonText() === 'Claim') {
              return 'bg-shaftkings-green-200 dark:bg-shaftkings-green-200/10 hover:bg-shaftkings-green-200/80 dark:hover:bg-shaftkings-green-200/40 text-white dark:text-shaftkings-green-200';
            }

            if (pnl === 0 || getButtonText() === 'Close Prediction') {
              return 'bg-shaftkings-red-300 hover:bg-shaftkings-red-300/80 dark:bg-shaftkings-red-300/10 dark:hover:bg-shaftkings-red-300/40 text-white dark:text-shaftkings-red-300';
            }

            if (
              isQuestionEnded &&
              marketData?.winningDirection === WinningDirection.DRAW
            ) {
              return 'bg-gray-400 dark:bg-shaftkings-dark-200 text-black/60 dark:text-shaftkings-dark-450';
            }

            if (
              isQuestionEnded &&
              (marketData?.winningDirection as 'Hype' | 'Flop') !==
                row.orderDirection
            ) {
              return 'bg-shaftkings-red-300 hover:bg-shaftkings-red-300/80 dark:bg-shaftkings-red-300/10 dark:hover:bg-shaftkings-red-300/40 text-white dark:text-shaftkings-red-300';
            }

            return pnl >= 0
              ? 'bg-shaftkings-green-200 dark:bg-shaftkings-green-200/10 hover:bg-shaftkings-green-200/80 dark:hover:bg-shaftkings-green-200/40 text-white dark:text-shaftkings-green-200'
              : 'bg-shaftkings-red-300 hover:bg-shaftkings-red-300/80 dark:bg-shaftkings-red-300/10 dark:hover:bg-shaftkings-red-200/40 text-white dark:text-shaftkings-red-300';
          };

          const buttonProps = {
            className: cn(
              'px-1 py-2 rounded-[1px] ml-auto min-w-[130px] text-xs',
              getButtonClass()
            ),
            color: 'tertiary' as const,
            disabled:
              loadingClosePositionIndex === index ||
              loadingClaimOrderPosition === index,
          };

          if (
            marketData?.winningDirection !== WinningDirection.NONE &&
            marketData?.isAllowedToPayout
          ) {
            return (
              <Button
                {...buttonProps}
                loading={loadingClaimOrderPosition === index}
                onClick={() => handleClaimClick(row)}
              >
                {getButtonText()}
              </Button>
            );
          }
          return <div className="flex items-end justify-end text-end">-</div>;
        },
      },
    ],
    [
      payoutFee,
      loadingClosePositionIndex,
      loadingClaimOrderPosition,
      handleClaimClick,
    ]
  );

  return (
    <div className={cn('w-full rounded-lg pb-1 lg:pb-0')}>
      {loading ? (
        <div className="min-h-[290px] w-full px-4">
          {Array.from({ length: 4 }).map((_, key) => (
            <div
              className="mb-2 h-[52px] w-full animate-pulse rounded-sm bg-black/10 dark:bg-shaftkings-gray-600"
              key={key}
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex min-h-[290px] flex-col items-center justify-center py-8 text-center">
          <p className="text-sm font-medium text-shaftkings-dark-100 dark:text-white lg:text-lg">
            No positions found for this market
          </p>
          <p className="mt-2 text-xs text-shaftkings-gray-600 dark:text-[#C0C0C0] lg:text-sm">
            You don&apos;t have any open positions at the moment
          </p>
        </div>
      ) : (
        <Table
          odd
          data={orders}
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
    </div>
  );
};

export default MyPredictionsTable;
