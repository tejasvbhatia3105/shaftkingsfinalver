// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */

'use client';

import { Table } from '@/components/Table';
import type { Order } from '@/types/market';
import { Direction, WinningDirection } from '@/types/market';

import { formatCurrency } from '@/utils/formatCurrency';
import { useCallback, useEffect, useMemo } from 'react';
import Tooltip from '@/components/Tooltip';
import { useGlobal } from '@/context/Global';
import { useMarket } from '@/context/Market';
import { useUser } from '@/context/User';
import { cn } from '@/utils/cn';
import { formatCents } from '@/utils/formatCents';
import { marketEnded } from '@/utils/helpers';
import calculatePnl from '@/utils/calculatePnl';
import { Button } from '@/components/Button';
import { PublicKey } from '@solana/web3.js';

const UserPredictions = ({
  orders,
  loading,
  pageWallet,
}: {
  orders: Order[];
  loading: boolean;
  pageWallet: string;
}) => {
  const {
    openModalPnlAfterClosePosition,
    loadingClosePositionIndex,
    claimPayoutOrder,
    loadingClaimOrderPosition,
  } = useMarket();
  const { setIsModalOpen } = useGlobal();
  const { openUserControl, wallet } = useUser();

  const handleClaimClick = useCallback(
    async (order: Order, index: number) => {
      const marketId = Number(order?.marketId);

      const isWinner =
        order.orderDirection ===
          (order.market.winningDirection as 'Hype' | 'Flop') ||
        (order.market.winningDirection as WinningDirection) ===
          WinningDirection.DRAW;

      if (!order.market?.mint) return;

      if (isWinner) {
        await claimPayoutOrder(
          [
            {
              marketId,
              orderId: Number(order.orderId),
              userNonce: Number(order.userNonce),
              mint: new PublicKey(order.market?.mint),
              isTrdPayout: order.isTrdPayout,
              shares: order.shares,
              orderDirection: order.orderDirection,
            },
          ],
          index
        );
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
    setIsModalOpen(openModalPnlAfterClosePosition);
  }, [openModalPnlAfterClosePosition, setIsModalOpen]);

  const calculateClosePayout = (row: Order, isMarketEnd: boolean) => {
    const marketData = row.market;
    if (!marketData) return 0;

    const direction = marketData.winningDirection;
    const isWinner = String(row.orderDirection) === String(direction);

    if (direction === WinningDirection.DRAW) {
      return row.shares * 0.5;
    }

    if (!isWinner && isMarketEnd) {
      return -row.amount;
    }

    return row.shares;
  };

  const calculatePnlForOrder = useCallback((order: Order) => {
    const marketData = order.market;
    if (!marketData) return 0;

    return calculatePnl(
      {
        hypeLiquidity: marketData.hypeLiquidity || '0',
        hypePrice: marketData.hypePrice || '0',
        flopLiquidity: marketData.flopLiquidity || '0',
        flopPrice: marketData.flopPrice || '0',
      },
      order
    );
  }, []);

  const columns = useMemo(
    () => [
      {
        header: 'Market / Type',
        accessor: (row: Order) => {
          const marketData = row.market;

          const currentDirectionName = marketData?.question;

          return (
            <div className="flex items-center">
              <img src={marketData?.image} className="size-10 " alt="" />

              <div className="ml-2">
                {currentDirectionName && (
                  <span className="w-fit whitespace-nowrap text-[11px] font-medium text-shaftkings-dark-100 dark:text-white lg:text-sm">
                    {currentDirectionName}
                  </span>
                )}
                <span
                  className={cn(
                    'block px-1 py-0.5 bg-opacity-10 w-fit',
                    row.orderDirection === Direction.HYPE
                      ? 'text-shaftkings-green-200'
                      : 'text-shaftkings-red-300',
                    row.orderDirection === Direction.HYPE
                      ? 'bg-shaftkings-green-200'
                      : 'bg-shaftkings-red-300'
                  )}
                >
                  {row.orderDirection === Direction.HYPE
                    ? row.market.yesSideName || 'Yes'
                    : row.market.noSideName || 'No'}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        header: (
          <Tooltip
            className="relative bottom-[3px] mr-auto w-fit border-b border-dashed border-shaftkings-gray-400 pb-0"
            direction="bottom"
            styleMessage="dark:bg-shaftkings-dark-250"
            tooltipMessage="The price at which a trade position is opened. It serves as a reference for calculating profit or loss as the asset’s price changes."
          >
            <span className="relative top-1">Entry Price</span>
          </Tooltip>
        ),
        accessor: (row: Order) => (
          <div className="flex flex-col">
            <span className="ml-auto w-fit whitespace-nowrap text-right text-xs font-medium text-shaftkings-dark-100 dark:text-white lg:pl-0 lg:text-base lg:leading-4">
              {formatCents(row.price)}
            </span>
            <span className="flex justify-end text-xs font-medium text-shaftkings-dark-100 dark:text-[#C0C0C0] lg:ml-0">
              {Number(row.shares).toFixed(2)}{' '}
              {Math.floor(row.shares) === 1 ? 'Share' : 'Shares'}
            </span>
          </div>
        ),
      },
      {
        header: (
          <Tooltip
            className={cn(
              'relative bottom-[3px] ml-auto  w-fit border-b border-dashed border-shaftkings-gray-400',
              {
                'mr-5': openUserControl && wallet?.connected,
              }
            )}
            direction="bottom"
            styleMessage="dark:bg-shaftkings-dark-250"
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

          const pnl = calculatePnlForOrder(row);

          return (
            <div
              className={cn(
                'ml-auto w-fit animate-pulse duration-75 ease-in text-right whitespace-nowrap',
                pnl > 0 ? 'text-shaftkings-green-200' : 'text-shaftkings-red-300'
              )}
            >
              <div className="flex items-center gap-x-1">
                <div>
                  <span className="text-sm font-semibold">
                    {formatCurrency(pnl)}
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
                Shares = 1 : 1 but a 5% fee must be applied for each market
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
              <span className="text-sm font-semibold">
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

          if (
            !wallet?.connected ||
            wallet?.publicKey.toBase58() !== pageWallet
          ) {
            return <div className="flex items-end justify-end text-end">-</div>;
          }

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
                onClick={() => handleClaimClick(row, index)}
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
      openUserControl,
      wallet?.connected,
      wallet?.publicKey,
      calculatePnlForOrder,
      pageWallet,
      loadingClosePositionIndex,
      loadingClaimOrderPosition,
      handleClaimClick,
    ]
  );

  return (
    <div className="min-h-[300px] w-full overflow-auto rounded-lg pb-1 lg:overflow-visible lg:pb-0">
      {loading ? (
        <div className="w-full px-4">
          {Array.from({ length: 4 }).map((_, key) => (
            <div
              className="my-2 h-[52px] w-full animate-pulse rounded-sm bg-black/10 dark:bg-shaftkings-gray-600"
              key={key}
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="my-20 flex h-full items-center justify-center text-center text-gray-500 dark:text-[#C0C0C0]">
          <p>No positions found</p>
        </div>
      ) : (
        <Table
          odd
          data={orders}
          columns={columns}
          className={{
            tbody: 'space-y-3 border-none',
            th: 'border-t-0 lg:px-5',
            td: 'lg:px-5 last-of-type:lg:pl-0',
            thead: 'border-t-0',
            tr: (row, index) =>
              cn(
                index % 2 === 0 ? 'dark:bg-white/[2%]' : 'dark:bg-black/[2%]',
                'hover:bg-transparent cursor-default dark:lg:odd:hover:bg-transparent dark:lg:even:hover:bg-transparent max-h-10'
              ),
          }}
        />
      )}
    </div>
  );
};

export default UserPredictions;
