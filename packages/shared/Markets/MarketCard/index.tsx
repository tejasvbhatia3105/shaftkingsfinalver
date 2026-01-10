// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */

'use client';

import { IconClock, IconPending } from '@/components/Icons';
import RenderOutcome from '@/components/Outcome';
import Tooltip from '@/components/Tooltip';
import type { Market, MainMarket } from '@/types/market';
import { MarketType, WinningDirection } from '@/types/market';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { format } from 'date-fns';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Countdown from '@/components/Countdown';
import { MontserratFont } from '@/utils/fonts';
import { useGlobal } from '@/context/Global';
import DefaultCardView from './default';
import MultipleCardView from './multiple';

export type MarketCardProps = {
  market: Market;
  data: MainMarket;
  agregattes?: Market[];
  columnPosition?: 'first' | 'middle' | 'last';
  isLastRow?: boolean;
};

const MarketCard: React.FC<MarketCardProps> = ({
  market,
  data,
  columnPosition,
  isLastRow,
}) => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const [isSingleLine, setIsSingleLine] = useState(true);
  const { homeTab } = useGlobal();

  const { marketEnd, id } = useMemo(() => {
    return {
      marketEnd: market?.marketEnd,
      marketStart: market?.marketStart,
      id: market?.id,
    };
  }, [market]);

  const filterMarkets = useCallback(
    (condition: (market: Market) => boolean) => {
      return data.markets?.filter(condition);
    },
    [data]
  );

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const getLineHeight = () => {
      const { fontSize, lineHeight } = getComputedStyle(element);
      const fontSizePx = parseFloat(fontSize);
      return lineHeight === 'normal'
        ? fontSizePx * 1.2
        : parseFloat(lineHeight);
    };

    const calculateLines = () => {
      const lineHeight = getLineHeight();
      const totalHeight = element.clientHeight;
      setIsSingleLine(totalHeight <= lineHeight + 1);
    };

    const observer = new ResizeObserver(calculateLines);
    observer.observe(element);
    calculateLines();

    return () => observer.disconnect();
  }, [data.question]);

  const tooltipDirection =
    columnPosition === 'last'
      ? 'left'
      : columnPosition === 'middle' && isLastRow
      ? 'right'
      : 'bottom';

  const tooltipStyleMessage =
    columnPosition === 'last'
      ? 'mt-4 ml-1'
      : columnPosition === 'first'
      ? 'mb-4'
      : '';

  const formattedMarketEnd = useMemo(() => {
    try {
      return format(new Date(Number(marketEnd) * 1000), 'MMM dd, HH:mm');
    } catch (error) {
      return '';
    }
  }, [marketEnd]);

  const filteredAgreggates = useMemo(() => {
    const now = new Date().getTime() / 1000;

    let filtered = [] as Market[];

    if (homeTab === 0) {
      filtered =
        filterMarkets(
          (mkt) => mkt.winningDirection === WinningDirection.NONE
        ) ?? [];
    }

    if (homeTab === 1) {
      filtered = filterMarkets((mkt) => now > Number(mkt.marketEnd)) ?? [];
    }

    if (homeTab === 2) {
      filtered =
        filterMarkets(
          (mkt) => mkt.winningDirection !== WinningDirection.NONE
        ) ?? [];
    }

    return filtered;
  }, [filterMarkets, homeTab]);

  const now = Date.now();
  const marketEndTime = Number(market?.marketEnd) * 1000;
  const hoursUntilEnd = (marketEndTime - now) / (1000 * 60 * 60);
  const showCountdown =
    hoursUntilEnd <= 24 && market.winningDirection === WinningDirection.NONE;

  if (!market) return;

  return (
    <Link
      href={`/market/${id}?question=${data.question}`}
      className={cn(
        'flex flex-col justify-between h-[198px] hover:shadow-2xl transition-all duration-200 ease-in dark:hover:shadow-none hover:dark:bg-white/[7%] w-full border border-black/5 dark:border-transparent bg-white px-3 pt-3 pb-2 text-start hover:cursor-pointer dark:bg-white/5 rounded-[1px]',
        MontserratFont.className
      )}
    >
      <div className="flex h-auto w-full flex-col gap-y-2.5 lg:gap-y-3">
        <div className={cn('flex gap-x-2.5 justify-between')}>
          <div
            className={cn('flex gap-x-2.5', {
              'items-center': isSingleLine,
              'items-start': !isSingleLine,
            })}
          >
            {market.image && (
              <img
                width={40}
                height={40}
                className="size-[40px] max-w-[40px] rounded-[1px] object-cover"
                src={data.image}
                alt={data.question}
              />
            )}
            <span
              ref={textRef}
              className={cn(
                'block text-sm font-semibold text-shaftkings-dark-100 dark:text-white line-clamp-2'
              )}
            >
              {data.question}
            </span>
          </div>
          {homeTab === 1 && filteredAgreggates.length > 0 && (
            <div className="flex items-center">
              <IconPending color="#F2BE47" />
              <span className="ml-[6px] text-sm text-[#F2BE47]">Pending</span>
            </div>
          )}
        </div>

        <div className="w-full">
          {homeTab !== 2 &&
            (data.type === MarketType.SINGLE ? (
              <DefaultCardView market={market} />
            ) : (
              <div className="max-h-[94px] overflow-y-auto">
                <MultipleCardView
                  marketResponse={data}
                  aggregates={filteredAgreggates}
                />
              </div>
            ))}
        </div>
      </div>

      <div>
        {homeTab === 2 && (
          <div className="mb-2 flex h-auto flex-col overflow-hidden lg:overflow-visible">
            <RenderOutcome market={market} agregattes={filteredAgreggates} />
          </div>
        )}

        <div className="flex size-full max-h-[20px] items-center justify-between text-xs font-medium text-shaftkings-gray-400 dark:text-[#C0C0C0]">
          <div className="flex items-center gap-x-1.5">
            <div className="space-x-1">
              <span>{formatCurrency(market.totalVolume || 0)}</span>
              <span>Vol.</span>
            </div>
          </div>

          <div className="flex items-center gap-x-1.5">
            {market.marketEnd && showCountdown ? (
              <Countdown
                target={marketEndTime / 1000}
                countdownEnd={() => {}}
                className="flex h-9 w-full items-center justify-center rounded-[1px] uppercase"
              />
            ) : (
              <Tooltip
                className="max-sm:pointer-events-none"
                tooltipMessage={<span>{formattedMarketEnd}</span>}
                direction={tooltipDirection}
                styleMessage={tooltipStyleMessage}
              >
                <div className="flex size-6 items-center justify-center rounded bg-white/5">
                  <IconClock color={theme === 'dark' ? '#A1A7BB' : '#606E85'} />
                </div>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MarketCard;
