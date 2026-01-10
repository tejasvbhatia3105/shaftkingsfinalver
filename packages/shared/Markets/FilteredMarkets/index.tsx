import type { Market, MainMarket } from '@/types/market';
import {
  filterEndingSoon,
  filterNewest,
  filterPending,
  filterResolved,
  filterTrending,
} from '@/utils/filtersByMarkets';
import { useEffect, useMemo, useState } from 'react';

export const useFilteredMarkets = (
  allMarkets: MainMarket[],
  activeFilter: string,
  searchQuery: string
) => {
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return useMemo(() => {
    const filteredResponses: MainMarket[] = allMarkets
      .map((response) => {
        const { totalLiquidity, totalVolume } = response.markets.reduce(
          (acc, market) => {
            const liquidity =
              (parseFloat(market.hypeLiquidity) || 0) +
              (parseFloat(market.flopLiquidity) || 0);
            const volume = parseFloat(market.volume) || 0;

            acc.totalLiquidity += liquidity;
            acc.totalVolume += volume;
            return acc;
          },
          { totalLiquidity: 0, totalVolume: 0 }
        );

        const createdAt = response.markets[0]?.marketStart?.toString() || '';

        const updatedResponse = {
          ...response,
          totalLiquidity,
          totalVolume,
          createdAt,
        };

        let filteredMarkets: Market[] = [...updatedResponse.markets];

        switch (activeFilter) {
          case 'Trending':
            filteredMarkets = filterTrending([updatedResponse])[0].markets;
            break;
          case 'Pending':
            filteredMarkets = filterPending([updatedResponse])[0].markets;
            break;
          case 'Resolved':
            filteredMarkets = filterResolved([updatedResponse])[0]?.markets;
            break;
          case 'Newest':
            filteredMarkets = filterNewest([updatedResponse])[0].markets;
            break;
          case 'Liquidity':
            filteredMarkets = updatedResponse.markets.sort(
              (a, b) =>
                (parseFloat(b.hypeLiquidity) || 0) +
                (parseFloat(b.flopLiquidity) || 0) -
                ((parseFloat(a.hypeLiquidity) || 0) +
                  (parseFloat(a.flopLiquidity) || 0))
            );
            break;
          case 'Volume':
            filteredMarkets = updatedResponse.markets.sort(
              (a, b) =>
                (parseFloat(b.volume) || 0) - (parseFloat(a.volume) || 0)
            );
            break;
          case 'Ending Soon':
            filteredMarkets = filterEndingSoon([updatedResponse])[0].markets;
            break;
          default:
            break;
        }

        if (debouncedSearchQuery.trim()) {
          filteredMarkets = filteredMarkets.filter((market) => {
            const query = searchQuery.toLowerCase();

            const questionMatch = response.question
              ?.toLowerCase()
              .includes(query);

            const winningDirectionMatch = market.winningDirection
              ? market.winningDirection.toLowerCase().includes(query)
              : false;

            return questionMatch || winningDirectionMatch;
          });
        }

        return filteredMarkets?.length > 0
          ? {
              ...updatedResponse,
              markets: filteredMarkets,
            }
          : null;
      })
      .filter(Boolean) as MainMarket[];

    return filteredResponses;
  }, [activeFilter, allMarkets, searchQuery, debouncedSearchQuery]);
};
