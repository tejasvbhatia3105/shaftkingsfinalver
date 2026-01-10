import { useCallback, useEffect, useRef, useState } from 'react';
import type { MainMarket } from '@/types/market';
import { IconSearch } from '@/components/Icons';
import { cn } from '@/utils/cn';
import MarketCard from '../../MarketCard';

const Markets = ({ markets }: { markets: MainMarket[] }) => {
  const itemsPerRow = 3;
  const [activeFilter, setActiveFilter] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const filters = ['Ending Soon', 'Newest', 'Volume'];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFocusBlur = useCallback((focused: boolean) => {
    setIsFocused(focused);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
    },
    []
  );

  const renderMarketCards = (marketsList: MainMarket[]) => {
    let filteredMarkets = [...marketsList];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filteredMarkets = filteredMarkets.filter((market) =>
        market.question?.toLowerCase().includes(query)
      );
    }

    let sortedMarkets = [...filteredMarkets];

    switch (activeFilter) {
      case 'Ending Soon': {
        sortedMarkets = sortedMarkets.sort((a, b) => {
          const marketEndA = Number(a.markets?.[0]?.marketEnd);
          const marketEndB = Number(b.markets?.[0]?.marketEnd);

          if (Number.isNaN(marketEndA)) return 1;
          if (Number.isNaN(marketEndB)) return -1;

          return marketEndA - marketEndB;
        });
        break;
      }

      case 'Newest': {
        const currentTime = Math.floor(new Date().getTime() / 1000);

        const activeMarkets = sortedMarkets.filter(
          (market) => Number(market.markets[0]?.marketEnd) > currentTime
        );

        activeMarkets.sort(
          (a, b) =>
            new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
        );

        sortedMarkets = [...activeMarkets];
        break;
      }

      case 'Volume': {
        sortedMarkets = sortedMarkets.sort((a, b) => {
          const totalVolumeA =
            a.markets.reduce(
              (sum, m) => sum + Number(m.hypeLiquidity ?? 0),
              0
            ) /
            10 ** 6;
          const totalVolumeB =
            b.markets.reduce(
              (sum, m) => sum + Number(m.hypeLiquidity ?? 0),
              0
            ) /
            10 ** 6;

          return totalVolumeB - totalVolumeA;
        });
        break;
      }

      default:
        break;
    }

    const totalItems = sortedMarkets.length;
    const totalRows = Math.ceil(totalItems / itemsPerRow);

    return sortedMarkets.map((market, idx) => {
      const sortedAggregates = [...market.markets].sort(
        (a, b) => Number(b.hypeLiquidity ?? 0) - Number(a.hypeLiquidity ?? 0)
      );

      const isLastColumn = (idx + 1) % itemsPerRow === 0;
      const isFirstColumn = idx % itemsPerRow === 0;
      const currentRow = Math.floor(idx / itemsPerRow) + 1;
      const isLastRow = currentRow === totalRows;

      return (
        <MarketCard
          key={idx}
          columnPosition={
            isFirstColumn ? 'first' : isLastColumn ? 'last' : 'middle'
          }
          isLastRow={isLastRow}
          market={sortedAggregates[0]}
          data={{ ...market }}
          agregattes={sortedAggregates}
        />
      );
    });
  };

  if (markets.length === 0) {
    return (
      <div className="my-6 flex h-48 items-center justify-center text-[#C0C0C0]">
        No markets yet.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="mt-6 hidden flex-row lg:flex">
        <div className="relative mr-4 h-10 flex-1">
          <span className="absolute left-3 top-2.5">
            <IconSearch />
          </span>
          <input
            className="h-10 w-full rounded-lg bg-white/10 pl-10 text-[13px] text-white placeholder:text-white/40"
            placeholder="Search markets, topics..."
            alt="input"
            value={searchQuery}
            ref={inputRef}
            onFocus={() => handleFocusBlur(true)}
            onBlur={() => handleFocusBlur(false)}
            onChange={handleSearchChange}
          />
          {!isFocused && searchQuery === '' && (
            <span className="absolute inset-y-0 right-3 m-auto flex size-6 items-center justify-center rounded-[1px] bg-white/5 text-sm text-[#C0C0C0]">
              /
            </span>
          )}
        </div>
        <div className="flex items-center gap-x-3">
          {filters.map((item, key) => (
            <button
              className={cn(
                'flex items-center gap-x-3 text-[13px] font-normal ',
                item === activeFilter ? 'text-white' : 'text-white/40'
              )}
              onClick={() => setActiveFilter(item)}
              key={key}
            >
              <div
                className={cn(
                  'size-4 rounded-full border border-white/50',
                  item === activeFilter && 'bg-[#F8E173]'
                )}
              ></div>
              {item}
            </button>
          ))}
        </div>
      </div>
      <span className="mt-8 hidden text-2xl font-bold text-white lg:block">
        Markets
      </span>
      <div className="relative grid w-full grid-cols-[repeat(auto-fill,_minmax(328px,_1fr))] gap-4 overflow-x-auto lg:overflow-x-hidden lg:pb-24">
        {renderMarketCards(markets)}
      </div>
    </div>
  );
};

export default Markets;
