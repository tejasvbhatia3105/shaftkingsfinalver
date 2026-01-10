'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import LineChart from '@/components/Charts/LineChart';
import MultiLineChart from '@/components/Charts/MultiLineChart';
import api from '@/constants/api';
import TradeCard from '@/components/TradeCard';
import { useMarket } from '@/context/Market';
import OutcomeResult from '@/shared/MarketDetails/OutComeCard';
import type {
  MarketPrice,
  MainMarket,
  Activity,
  Holders,
  Order,
  OrderBook,
  Market,
} from '@/types/market';
import { MarketType, WinningDirection } from '@/types/market';
import { cn } from '@/utils/cn';
import { convertToPercentage } from '@/utils/convertToPercentage';
import { getLegendColor } from '@/utils/getLegendColor';
import { useUser } from '@/context/User';
import socket from '@/utils/socket';
import { marketEnded } from '@/utils/helpers';
import { useGlobal } from '@/context/Global';
import RulesModal from '@/components/RulesModal';
import CurrentQuestion from './CurrentQuestion';
import MarketDepositMobile from './Mobile';
import Prices from './Prices';
import MultipleQuestionsTable from './Table/MultipleQuestions';
import MarketDetailsTabs from './Tabs';
import Timeline from './Timeline';
import InnerMarketTabs from '../Markets/InnerMarketTabs';

const MarketDetails = ({ mainMarket }: { mainMarket: MainMarket }) => {
  const { setSelectedMarket, selectedMarket, setAllMarkets } = useMarket();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [allMarketPrice, setAllMarketPrice] = useState<MarketPrice[][]>([]);
  const [marketPrice, setMarketPrice] = useState<MarketPrice[]>([]);
  const [holders, setHolders] = useState<{
    hype: Holders[];
    flop: Holders[];
  }>({ hype: [], flop: [] });
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook>({
    hype: { ask: [], bid: [], lastPrice: 0 },
    flop: { ask: [], bid: [], lastPrice: 0 },
    rewardsAvailable: '0',
    rewardsClaimed: '0',
    spreadToReward: '0',
    marketId: 0,
  });
  const [loadingOrderBook, setLoadingOrderBook] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { wallet } = useUser();
  const [activity, setActivity] = useState<Activity[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const { setRulesModalOpen, rulesModalOpen } = useGlobal();

  useEffect(() => {
    const newParams = new URLSearchParams(Array.from(searchParams.entries()));
    const formattedQuestion = mainMarket.question
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    newParams.set('question', formattedQuestion);
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  }, [mainMarket?.question, pathname, router, searchParams]);

  useEffect(() => {
    if (!mainMarket?.markets?.length) return;

    const firstActiveMarket = mainMarket.markets
      .sort((a, b) => {
        if (
          a.winningDirection !== WinningDirection.NONE &&
          b.winningDirection === WinningDirection.NONE
        )
          return 1;
        if (
          a.winningDirection === WinningDirection.NONE &&
          b.winningDirection !== WinningDirection.NONE
        )
          return -1;

        return Number(b.totalVolume) - Number(a.totalVolume);
      })
      .find((market) => market.winningDirection === WinningDirection.NONE);

    if (firstActiveMarket) {
      setSelectedMarket(firstActiveMarket);
    } else {
      setSelectedMarket(mainMarket.markets[0]);
    }

    return () => {
      setSelectedMarket(null);
    };
  }, [mainMarket?.markets, setSelectedMarket]);

  useEffect(() => {
    if (!selectedMarket?.id) return;

    api
      .get(`/market/${selectedMarket?.id}/holders`)
      .then((res) => {
        setHolders(res.data);
      })
      .catch(() => {
        /* empty */
      });

    return () => {
      setHolders({ hype: [], flop: [] });
    };
  }, [selectedMarket?.id]);

  useEffect(() => {
    if (!selectedMarket?.id) return;

    setIsLoadingActivity(true);
    setActivity([]);

    api
      .get(`/market/${selectedMarket?.id}/activity`)
      .then((res) => {
        setActivity(res.data);
        setIsLoadingActivity(false);
      })
      .catch(() => {
        setIsLoadingActivity(false);
      });

    return () => {
      setActivity([]);
      setIsLoadingActivity(false);
    };
  }, [selectedMarket?.id, selectedMarket?.winningDirection]);

  const getMarketPrices = useCallback(() => {
    if (!mainMarket?.id) return;

    if (mainMarket.type === MarketType.POOL) {
      setIsLoadingChart(true);

      api
        .get(`/market/pool/${mainMarket.id}/prices`)
        .then((res) => {
          setAllMarketPrice(res.data as MarketPrice[][]);
          setIsLoadingChart(false);
        })
        .catch(() => {
          setIsLoadingChart(false);
        });
    }

    return () => {
      setAllMarketPrice([]);
      setIsLoadingChart(false);
    };
  }, [mainMarket.type, mainMarket.id]);

  useEffect(() => {
    getMarketPrices();
  }, [getMarketPrices]);

  const getMarketPrice = useCallback(() => {
    if (!selectedMarket?.id) return;

    if (mainMarket?.type === MarketType.SINGLE) {
      setIsLoadingChart(true);

      api
        .get(`/market/${selectedMarket.id}/price`)
        .then((res) => {
          setMarketPrice(res.data as MarketPrice[]);
          setIsLoadingChart(false);
        })
        .catch(() => {
          setIsLoadingChart(false);
        });
    }

    return () => {
      setMarketPrice([]);
      setIsLoadingChart(false);
    };
  }, [selectedMarket?.id, mainMarket?.type]);

  useEffect(() => {
    getMarketPrice();
  }, [getMarketPrice]);

  const getOrders = useCallback(() => {
    if (!selectedMarket?.id) return;

    if (!wallet?.publicKey?.toBase58()) return;

    api
      .get(
        `/user/${wallet.publicKey.toBase58()}/orders?marketId=${
          selectedMarket?.id
        }&status=Open`
      )
      .then((res) => {
        setOrders(res.data);
      })
      .catch(() => {
        /* empty */
      });
  }, [selectedMarket?.id, wallet?.publicKey]);

  useEffect(() => {
    getOrders();

    return () => {
      setOrders([]);
    };
  }, [getOrders]);

  const getOrderBook = useCallback(() => {
    if (!selectedMarket?.id) return;

    if (Number(selectedMarket.id) <= 310) return;

    setLoadingOrderBook(true);

    api
      .get(`/market/${selectedMarket.id}/orderbook`)
      .then((res) => {
        let hypeLastPrice = 0;
        let flopLastPrice = 0;

        hypeLastPrice = selectedMarket?.hypePrice || 0;
        flopLastPrice = selectedMarket?.flopPrice || 0;

        setOrderBook({
          ...res.data,
          hype: {
            ask: res.data.hype.ask,
            bid: res.data.hype.bid,
            lastPrice: hypeLastPrice,
          },
          flop: {
            ask: res.data.flop.ask,
            bid: res.data.flop.bid,
            lastPrice: flopLastPrice,
          },
        });

        setLoadingOrderBook(false);
      })
      .catch(() => {
        setLoadingOrderBook(false);
      });
  }, [
    selectedMarket?.id,
    selectedMarket?.hypePrice,
    selectedMarket?.flopPrice,
  ]);

  useEffect(() => {
    getOrderBook();

    return () => {
      setLoadingOrderBook(false);
      setOrderBook({
        hype: { ask: [], bid: [], lastPrice: 0 },
        flop: { ask: [], bid: [], lastPrice: 0 },
        rewardsAvailable: '0',
        rewardsClaimed: '0',
        spreadToReward: '0',
        marketId: 0,
      });
    };
  }, [getOrderBook]);

  useEffect(() => {
    if (!selectedMarket?.id) return;

    const channel = `BOOK_ORDER_UPDATED_${selectedMarket?.id}`;

    socket.off(channel);

    socket.on(channel, (_: Activity) => {
      getOrderBook();
    });

    return () => {
      socket.off(channel);
    };
  }, [selectedMarket?.id, getOrderBook]);

  useEffect(() => {
    if (!selectedMarket?.id) return;

    const channel = `PRICE_UPDATED_${selectedMarket?.id}`;

    socket.off(channel);

    socket.on(channel, (data) => {
      if (
        mainMarket?.type === MarketType.SINGLE &&
        Number(selectedMarket?.id) === Number(data.marketId)
      ) {
        getMarketPrice();
      }

      if (mainMarket?.type === MarketType.POOL) {
        getMarketPrices();
      }
    });

    return () => {
      socket.off(channel);
    };
  }, [selectedMarket?.id, getMarketPrice, getMarketPrices, mainMarket?.type]);

  useEffect(() => {
    if (!selectedMarket?.id) return;

    const channel = `ACTIVITY_EVENT_${selectedMarket?.id}`;

    socket.off(channel);
    socket.on(channel, (event: Activity) => {
      setActivity((prev) => {
        try {
          return [event, ...prev];
        } catch {
          return prev;
        }
      });
    });

    return () => {
      socket.off(channel);
    };
  }, [selectedMarket?.id]);

  useEffect(() => {
    if (!selectedMarket?.id) return;

    const channel = `ORDER_CREATED_${
      selectedMarket?.id
    }_${wallet?.publicKey?.toBase58()}`;

    socket.off(channel);

    socket.on(channel, (_: Order) => {
      getOrders();
    });

    return () => {
      socket.off(channel);
    };
  }, [selectedMarket?.id, wallet?.publicKey, getOrders]);

  useEffect(() => {
    if (!selectedMarket?.id) return;

    const channel = `MARKET_UPDATED_${selectedMarket?.id}`;

    socket.off(channel);

    socket.on(channel, (data: Market) => {
      if (selectedMarket?.id === data.id) {
        setSelectedMarket((prev) => ({
          ...prev,
          ...data,
          hypePrice: Number(data.hypePrice),
          flopPrice: Number(data.flopPrice),
          totalVolume: Number(data.volume),
          openBets:
            (parseFloat(data.flopShares) + parseFloat(data.hypeShares)) /
            10 ** 6,
        }));
      }

      setAllMarkets((prev: MainMarket[]) => {
        return prev.map((market) => {
          const findMarket = market.markets.find((item) => item.id === data.id);

          if (findMarket) {
            return {
              ...market,
              markets: market.markets.map((item) => {
                if (Number(item.id) === Number(data.id)) {
                  return {
                    ...item,
                    ...data,
                    hypePrice: Number(data.hypePrice),
                    flopPrice: Number(data.flopPrice),
                    totalVolume: Number(data.volume),
                    openBets:
                      (parseFloat(data.flopShares) +
                        parseFloat(data.hypeShares)) /
                      10 ** 6,
                  };
                }

                return item;
              }),
            };
          }

          return market;
        });
      });
    });

    return () => {
      socket.off(channel);
    };
  }, [selectedMarket?.id, setSelectedMarket, setAllMarkets]);

  useEffect(() => {
    const windowWidth = window.innerWidth;
    setIsMobile(windowWidth < 1023);
  }, []);

  const chartData = useMemo(() => {
    const data = marketPrice
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .map((market) => ({
        time: market.timestamp,
        date: market.timestamp,
        value: market.currentPrice,
        open: market.currentPrice,
        price: market.hypePrice,
      }));
    return data || [];
  }, [marketPrice]);

  const poolMarkets = useMemo(() => {
    if (mainMarket?.type === MarketType.POOL) {
      return mainMarket.markets.slice().sort((a, b) => {
        if (
          a.winningDirection !== WinningDirection.NONE &&
          b.winningDirection === WinningDirection.NONE
        )
          return 1;
        if (
          a.winningDirection === WinningDirection.NONE &&
          b.winningDirection !== WinningDirection.NONE
        )
          return -1;

        return Number(b.totalVolume) - Number(a.totalVolume);
      });
    }
    return [];
  }, [mainMarket?.markets, mainMarket?.type]);

  const isMarketEnd = useMemo(
    () =>
      marketEnded({
        marketEnd: selectedMarket?.marketEnd || '',
        winningDirection: selectedMarket?.winningDirection as WinningDirection,
      }),
    [selectedMarket]
  );

  const agreggateLegends = useMemo(() => {
    return poolMarkets
      .filter((market) => market.winningDirection === WinningDirection.NONE)
      .sort((a, b) => b.totalVolume - a.totalVolume)
      .map((item, index) => {
        const percentage = item.hypePrice * 100;

        return {
          legend: `${item.question} ${convertToPercentage(percentage)}`,
          color: getLegendColor(index),
        };
      });
  }, [poolMarkets]);

  const filteredMarketPriceData = useMemo(() => {
    if (mainMarket?.type !== MarketType.POOL) return [[]];

    if (mainMarket?.type === MarketType.POOL) {
      const marketOrder = mainMarket.markets
        .filter((market) => market.winningDirection === WinningDirection.NONE)
        .sort((a, b) => b.totalVolume - a.totalVolume)
        .slice(0, 5)
        .map((market) => Number(market.id));

      return marketOrder.map((id) => {
        const data = allMarketPrice.find(
          (marketData) => Number(marketData[0]?.marketId) === id
        );

        const startDate = mainMarket.markets[0].marketStart;

        if (!data || data.length === 0) {
          return [
            {
              id: `${id}`,
              marketId: id,
              currentPrice: 0.5,
              hypePrice: 0.5,
              flopPrice: 0.5,
              direction: 'Hype' as 'Hype' | 'Flop',
              timestamp: new Date(Number(startDate) * 1000).toISOString(),
              comment: null,
            },
            {
              id: `${id}`,
              marketId: id,
              currentPrice: 0.5,
              hypePrice: 0.5,
              flopPrice: 0.5,
              direction: 'Hype' as 'Hype' | 'Flop',
              timestamp: new Date().toISOString(),
              comment: null,
            },
          ];
        }

        const sorted = [
          {
            id: `${id}`,
            marketId: id,
            currentPrice: 0.5,
            hypePrice: 0.5,
            flopPrice: 0.5,
            direction: 'Hype' as 'Hype' | 'Flop',
            timestamp: new Date(Number(startDate) * 1000).toISOString(),
            comment: null,
          },
          ...data,
        ].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        const last = sorted[sorted.length - 1];

        if (last) {
          sorted.push({
            ...last,
            timestamp: new Date().toISOString(),
          });
        }

        return sorted;
      });
    }

    return allMarketPrice;
  }, [allMarketPrice, mainMarket]);

  const filterChartDataByTimeRange = useCallback((data: typeof chartData) => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const currentTime = new Date();

    const sortedData = [...data]
      .filter(
        (item) => !!item.time && !Number.isNaN(new Date(item.time).getTime())
      )
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    if (sortedData?.length === 0) return [];

    const lastKnown = sortedData[sortedData.length - 1];

    return [
      ...sortedData,
      {
        ...lastKnown,
        time: currentTime.toISOString(),
      },
    ];
  }, []);

  const filteredChartData = useMemo(() => {
    if (chartData?.length === 0) return [];

    return filterChartDataByTimeRange(chartData);
  }, [chartData, filterChartDataByTimeRange]);

  const resolvedMarkets = useMemo(() => {
    return (mainMarket?.markets || []).filter(
      (market) => market.winningDirection !== WinningDirection.NONE
    );
  }, [mainMarket?.markets]);

  const switchChartType = useMemo(() => {
    if (isMarketEnd) {
      return null;
    }

    if (mainMarket?.type === MarketType.POOL) {
      return (
        <MultiLineChart
          data={filteredMarketPriceData}
          mainMarket={mainMarket}
        />
      );
    }

    return (
      <LineChart
        data={
          filteredChartData.length === 0
            ? [
                {
                  time: new Date(
                    Date.now() - 24 * 60 * 60 * 1000
                  ).toISOString(),
                  date: new Date(
                    Date.now() - 24 * 60 * 60 * 1000
                  ).toISOString(),
                  value: 0,
                  price: 0.5,
                },
                {
                  time: new Date().toISOString(),
                  date: new Date().toISOString(),
                  value: 0,
                  price: 0.5,
                },
              ]
            : filteredChartData
        }
      />
    );
  }, [mainMarket, filteredChartData, filteredMarketPriceData, isMarketEnd]);

  const marketIndex = useMemo(
    () =>
      mainMarket?.markets.findIndex((item) => item.id === selectedMarket?.id),
    [mainMarket?.markets, selectedMarket?.id]
  );

  const question = useMemo(() => {
    if (mainMarket.type === MarketType.POOL) {
      return mainMarket.question;
    }

    if (!selectedMarket) return '';

    return selectedMarket.question;
  }, [selectedMarket, mainMarket]);

  return (
    <>
      <div
        className="relative z-10 mx-auto flex w-full px-2.5 py-4 pb-20 lg:max-w-[1280px] lg:gap-x-6 lg:py-11"
        data-market-details
      >
        <div className="flex w-full flex-col lg:max-w-[calc(100%-380px)]">
          <div className="flex w-full flex-col justify-between sm:mt-4 md:flex-row md:items-center lg:mt-0">
            <CurrentQuestion
              data={{
                currentQuestion: question,
                image: mainMarket?.image,
              }}
            />
          </div>

          <div
            className={cn('flex flex-col', {
              'max-h-20 lg:max-h-[58px]':
                mainMarket?.type === MarketType.SINGLE,
            })}
          >
            <Prices selectedMarket={selectedMarket} mainMarket={mainMarket} />

            <div className="mb-[18px] mt-2 flex flex-col items-center justify-between gap-5 lg:flex-row">
              <div className="flex w-full flex-row gap-3 overflow-x-auto overflow-y-hidden max-sm:mt-2 lg:items-center">
                {agreggateLegends.slice(0, 5).map((item, idx) => (
                  <span
                    className="flex items-center gap-1 whitespace-nowrap text-[13px] leading-3 text-shaftkings-gray-400 dark:text-[#C0C0C0]"
                    key={idx}
                  >
                    <span
                      className="size-2 min-h-2 min-w-2 rounded-full"
                      style={{ background: item.color }}
                    ></span>{' '}
                    {item.legend}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {isLoadingChart ? (
            <div className="mt-7 flex h-[345px] flex-col gap-y-2">
              <div className="flex size-full items-center gap-x-1">
                {Array.from({ length: 1 }).map((_, key) => (
                  <div
                    key={key}
                    className="relative size-full overflow-hidden rounded-[10px] border bg-black/10 dark:border-shaftkings-gray-600/40 dark:bg-transparent"
                  >
                    <svg
                      viewBox="0 0 500 400"
                      preserveAspectRatio="none"
                      className="absolute left-0 top-0 size-full animate-pulse"
                    >
                      {Array.from({ length: 9 }).map((item, i) => {
                        const y = (400 / 8) * i;
                        return (
                          <line
                            key={i}
                            x1="0"
                            y1={y}
                            x2="500"
                            y2={y}
                            stroke="#37404e "
                            strokeWidth="1"
                            strokeDasharray="4,6"
                          />
                        );
                      })}

                      <path
                        d="M 0 300 Q 100 200 200 250 T 400 200 T 500 250"
                        fill="none"
                        stroke="#37404e"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                ))}
              </div>
              <div className="flex size-full max-h-10 items-center justify-between">
                <div className="flex h-full w-2/4 items-center justify-end gap-x-1">
                  {Array.from({ length: 1 }).map((_, key) => (
                    <div
                      key={key}
                      className="animate-loading relative mt-2 size-full rounded-md bg-black/10 dark:bg-shaftkings-gray-600 lg:mt-0 lg:min-w-[130px]"
                    />
                  ))}
                </div>
                <div className="flex items-center justify-end gap-x-1">
                  {Array.from({ length: 1 }).map((_, key) => (
                    <div
                      key={key}
                      className="animate-loading relative mt-2 size-[30px] rounded bg-black/10 dark:bg-shaftkings-gray-600 lg:mt-0"
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            switchChartType
          )}

          <div
            className={cn(
              ' flex w-full flex-col justify-center gap-y-10 lg:gap-y-4',
              { 'mt-6': !isMarketEnd }
            )}
          >
            {(mainMarket?.type === MarketType.SINGLE ||
              mainMarket?.type === MarketType.POOL_AGGREGATOR) && (
              <InnerMarketTabs
                mainMarket={mainMarket}
                orders={orders}
                orderBook={orderBook}
                loadingOrderBook={loadingOrderBook}
              />
            )}

            {mainMarket?.type === MarketType.POOL && (
              <MultipleQuestionsTable
                mainMarket={mainMarket}
                aggregates={poolMarkets}
                orders={orders}
                orderBook={orderBook}
                loadingOrderBook={loadingOrderBook}
              />
            )}

            <Timeline mainMarket={mainMarket} />

            <MarketDetailsTabs
              mainMarket={mainMarket}
              activity={activity}
              holders={holders}
              isLoadingActivity={isLoadingActivity}
            />
          </div>
        </div>

        <div className="relative hidden w-full min-w-[345px] lg:block lg:max-w-[345px]">
          <div className="sticky top-20">
            {!isMarketEnd && selectedMarket ? (
              <TradeCard
                mainMarket={mainMarket}
                market={selectedMarket}
                type={mainMarket.type}
                marketIndex={marketIndex}
                orders={orders}
                orderBook={orderBook}
              />
            ) : (
              <OutcomeResult
                aggregates={resolvedMarkets}
                mainMarket={mainMarket}
              />
            )}
          </div>
        </div>
      </div>

      {isMobile && (
        <MarketDepositMobile
          mainMarket={mainMarket}
          marketIndex={marketIndex}
          orders={orders}
          orderBook={orderBook}
        />
      )}
      {rulesModalOpen && (
        <RulesModal
          isOpen={rulesModalOpen}
          onClose={() => setRulesModalOpen(false)}
        />
      )}
    </>
  );
};

export default MarketDetails;
