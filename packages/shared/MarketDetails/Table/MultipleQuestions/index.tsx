// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */

'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { CheckIcon, CloseCircleIcon, IconArrowDown } from '@/components/Icons';
import { useMarket } from '@/context/Market';
import InnerMarketTabs from '@/shared/Markets/InnerMarketTabs';
import {
  WinningDirection,
  type MainMarket,
  type Market,
  type Order,
  type OrderBook,
} from '@/types/market';
import { cn } from '@/utils/cn';
import { InterFont } from '@/utils/fonts';
import { formatCents } from '@/utils/formatCents';
import { formatCurrency } from '@/utils/formatCurrency';

export type MultipleQuestionsProps = {
  mainMarket: MainMarket;
  aggregates: Market[];
  loading?: boolean;
  orders: Order[];
  orderBook: OrderBook;
  loadingOrderBook: boolean;
};

const MultipleQuestionsTable: React.FC<MultipleQuestionsProps> = ({
  mainMarket,
  aggregates,
  loading,
  orders,
  orderBook,
  loadingOrderBook,
}) => {
  const {
    setSelectedOption,
    selectedMarket,
    selectedOption,
    setSelectedMarket,
  } = useMarket();
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [resolvedExpanded, setResolvedExpanded] = useState(false);
  const resolvedContentRef = useRef<HTMLDivElement>(null);

  const handleSelectedMarket = useCallback(
    (option: string, market: Market) => {
      setSelectedOption(option);
      setSelectedMarket(market);
    },
    [setSelectedMarket, setSelectedOption]
  );

  const resolvedMarkets = useMemo(
    () =>
      aggregates.filter(
        (market) => market.winningDirection !== WinningDirection.NONE
      ),
    [aggregates]
  );

  const activeMarkets = useMemo(
    () =>
      aggregates.filter(
        (market) => market.winningDirection === WinningDirection.NONE
      ),
    [aggregates]
  );

  const renderMarketRow = useCallback(
    (market: Market, index: number) => {
      const isHypeWinner = market.winningDirection === WinningDirection.HYPE;

      const textColor = isHypeWinner
        ? 'text-shaftkings-green-200'
        : 'text-shaftkings-red-200';

      // const findIndex = agregattes.findIndex((item) => item.id === market.id);
      // // const randomColor = getLegendColor(findIndex);

      // const hypeLiquidity = Number(market.hypeLiquidity)  ;
      // const percentage = calculateLiquidityPercentage(
      //   hypeLiquidity,
      //   totalLiquidity
      // );

      const isExpanded =
        Number(selectedMarket?.id) === Number(market.id) && expanded;

      let chance = Number(market.hypePrice * 100).toFixed(0);

      if (market.winningDirection !== WinningDirection.NONE) {
        chance = '-';
      }

      return (
        <div key={index} className="transition-all duration-300 ease-in-out ">
          <div
            onClick={() => {
              setSelectedMarket(market);
              if (Number(market.id) === Number(selectedMarket?.id)) {
                setExpanded(!expanded);
              }
            }}
            className={cn(
              'grid w-full cursor-pointer grid-cols-3 place-content-center rounded-[10px] p-3 hover:bg-white/5',
              {
                'bg-white/5':
                  Number(market.id) === Number(selectedMarket?.id) && expanded,
              }
            )}
          >
            <div className="flex items-center">
              {/* <div
              className="mr-3 size-2 rounded-full"
              style={{ backgroundColor: randomColor }}
            /> */}
              <img
                className="mr-1 size-7 min-h-7 min-w-7 rounded-[10px] object-cover lg:mr-4 lg:size-[46px] lg:min-w-[46px]"
                src={market.image}
                alt={market.question}
              />
              <div className="ml-0.5 flex w-fit flex-col text-shaftkings-gray-400 dark:text-[#C0C0C0]">
                <span className="block w-fit truncate text-xs font-semibold text-shaftkings-dark-100 dark:text-white lg:text-base xl:text-nowrap">
                  {market.question}
                </span>
                <div className="mt-1 flex items-center gap-x-1 whitespace-nowrap text-xs">
                  <span>{formatCurrency(Number(market.volume) * 1)}</span>

                  <span>Vol.</span>
                </div>
              </div>
            </div>

            <div className="relative left-2 ml-auto flex w-[58px] items-center lg:w-[90px] lg:justify-end">
              <div className="w-[58px] lg:w-[90px]">
                <span className="block text-center text-xl font-semibold text-shaftkings-dark-100 dark:text-white lg:text-left lg:text-3xl">
                  {chance}%
                </span>
              </div>
            </div>

            <div>
              {market.winningDirection !== WinningDirection.NONE ? (
                <div className="ml-auto flex w-fit items-center justify-items-center text-right text-sm lg:text-2xl">
                  <div
                    className={cn(
                      'flex w-full gap-x-1 items-center justify-center rounded-[1px] h-[46px] font-semibold',
                      textColor,
                      InterFont.className
                    )}
                  >
                    {market.winningDirection === WinningDirection.HYPE ? (
                      <CheckIcon className="size-5" />
                    ) : (
                      <CloseCircleIcon className="size-5" />
                    )}
                    <span>
                      {market.winningDirection === WinningDirection.HYPE
                        ? 'Yes'
                        : 'No'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="ml-auto flex items-center justify-end gap-x-2.5">
                  {['Yes', 'No'].map((type, idx) => {
                    const isHype = type === 'Yes';
                    const isSelected =
                      market.id === selectedMarket?.id &&
                      type === selectedOption;

                    const className = isHype
                      ? cn(
                          'bg-shaftkings-green-200/10 text-shaftkings-green-200 hover:bg-shaftkings-green-200',
                          {
                            'bg-shaftkings-green-200 text-white': isSelected,
                          }
                        )
                      : cn(
                          'bg-shaftkings-red-300/10 text-shaftkings-red-300 hover:bg-shaftkings-red-200',
                          {
                            'bg-shaftkings-red-200 text-white': isSelected,
                          }
                        );

                    return (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectedMarket(type, market);
                        }}
                        key={idx}
                        className={cn(
                          `flex h-[46px] w-full min-w-[80px] max-w-[80px] lg:min-w-[105px] lg:max-w-[105px] items-center justify-center rounded-[1px] font-semibold transition-colors duration-100 ease-in-out hover:text-white ${className} text-sm`
                        )}
                      >
                        <span className="mr-1 hidden lg:block">{type} </span>
                        {isHype
                          ? formatCents(market.hypePrice)
                          : formatCents(market.flopPrice)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div
            ref={contentRef}
            style={{
              maxHeight: isExpanded ? contentRef.current?.scrollHeight : 0,
              opacity: isExpanded ? 1 : 0,
              transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)',
            }}
            className="overflow-auto transition-all duration-500 ease-in-out lg:overflow-hidden"
          >
            <div className="px-2 pb-2 pt-1">
              <InnerMarketTabs
                mainMarket={mainMarket}
                orders={orders}
                orderBook={orderBook}
                loadingOrderBook={loadingOrderBook}
              />
            </div>
          </div>
        </div>
      );
    },
    [
      expanded,
      handleSelectedMarket,
      loadingOrderBook,
      mainMarket,
      orderBook,
      orders,
      selectedMarket?.id,
      selectedOption,
      setSelectedMarket,
    ]
  );

  return (
    <div className="size-full rounded-lg pb-1 lg:overflow-visible lg:pb-0">
      <div className="max-sm:overflow-x-auto">
        <div className="w-full min-w-[415px]">
          <div className="grid grid-cols-3 border-y border-y-[#E5E5E5] py-1 dark:border-white/5">
            {['Outcome', 'Chance', 'Action'].map((header, index) => (
              <div
                key={index}
                className={cn(
                  'px-4 py-2 text-xs font-normal text-shaftkings-dark-100 dark:text-[#C0C0C0] lg:gap-x-2',
                  {
                    'lg:text-right lg:pr-7 w-full': index === 1,
                    'text-right': index === 2,
                  }
                )}
              >
                {header}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="w-full px-4">
              {Array.from({ length: 4 }).map((_, key) => (
                <div
                  key={key}
                  className="mb-2 h-[52px] w-full animate-pulse rounded-sm bg-black/10 dark:bg-shaftkings-gray-600"
                />
              ))}
            </div>
          ) : (
            <div className="w-full  overflow-x-auto">
              {activeMarkets.map((market, index) =>
                renderMarketRow(market, index)
              )}

              {resolvedMarkets.length > 0 && (
                <div className="border-[#E5E5E5] dark:border-white/5">
                  <div
                    className="flex cursor-pointer items-center gap-x-1 px-4 py-2"
                    onClick={() => setResolvedExpanded(!resolvedExpanded)}
                  >
                    <h3 className="text-sm font-semibold text-shaftkings-dark-100 dark:text-white">
                      Resolved Multiple Outcome
                    </h3>
                    <div
                      className={`transition-transform duration-300 ${
                        resolvedExpanded ? ' -rotate-90' : 'rotate-90'
                      }`}
                    >
                      <IconArrowDown
                        color="#FFFFFF"
                        circle={false}
                        className="size-4 rotate-90 text-shaftkings-dark-100 dark:text-white"
                      />
                    </div>
                  </div>

                  <div
                    ref={resolvedContentRef}
                    style={{
                      maxHeight: expanded ? '600px' : 0,
                      opacity: expanded ? 1 : 0,
                    }}
                    className="transition-all duration-500 ease-in-out"
                  >
                    <div className="divide-y divide-black/5 py-1 dark:divide-white/5">
                      {resolvedMarkets.map((market, index) =>
                        renderMarketRow(market, index)
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultipleQuestionsTable;
