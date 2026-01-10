import { WinningDirection} from '@/types/market';
import type { MainMarket } from '@/types/market';

export const filterNewest = (
  MainMarkets: MainMarket[]
): MainMarket[] => {
  return MainMarkets.map((response) => {
    const updatedMarkets = response.markets.map((market) => ({
      ...market,
      marketStart: market.marketStart,
      marketEnd: market.marketEnd,
    }));

    updatedMarkets.sort(
      (a, b) => Number(b.marketStart) - Number(a.marketStart)
    );

    return {
      ...response,
      markets: updatedMarkets,
    };
  });
};

export const filterResolved = (
  MainMarkets: MainMarket[]
): MainMarket[] => {
  return MainMarkets.filter((item) => {
    return !item.markets.some((market) => market.winningDirection === WinningDirection.NONE);
  });
};

export const filterEndingSoon = (markets: MainMarket[]) => {
  return markets.map((item) => ({
    ...item,
    markets: item.markets
      .filter((market) => market.winningDirection === WinningDirection.NONE)
      .sort((a, b) => {
        const aEnd = new Date(Number(a.marketEnd)).getTime();
        const bEnd = new Date(Number(b.marketEnd)).getTime();
        return aEnd - bEnd;
      }),
  }));
};

export const filterTrending = (
  MainMarkets: MainMarket[]
): MainMarket[] => {
  const currentTimestamp = Math.floor(new Date().getTime() / 1000);

  return MainMarkets.map((response) => {
    const updatedMarkets = response.markets.filter(
      (market) =>
        market.winningDirection === WinningDirection.NONE &&
        Number(market.marketEnd) >= currentTimestamp
    );

    return {
      ...response,
      markets: updatedMarkets,
    };
  });
};

export const filterPending = (
  MainMarkets: MainMarket[]
): MainMarket[] => {
  const currentTimestamp = Math.floor(new Date().getTime() / 1000);

  return MainMarkets.map((response) => {
    const updatedMarkets = response.markets.filter(
      (market) =>
        market.winningDirection === WinningDirection.NONE &&
        Number(market.marketEnd) <= currentTimestamp
    );

    return {
      ...response,
      markets: updatedMarkets,
    };
  });
};
