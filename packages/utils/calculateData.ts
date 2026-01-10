import type { MainMarket, Market } from '@/types/market';
import { MarketType } from '@/types/market';

export const calculateVolume = (marketResponse: MainMarket | undefined) => {
  if (
    marketResponse?.type === MarketType.POOL ||
    marketResponse?.type === MarketType.POOL_AGGREGATOR
  ) {
    const result = marketResponse.markets.reduce(
      (total, market) => total + (Number(market.volume) || 0),
      0
    );

    return result;
  }

  const result = marketResponse?.markets.reduce(
    (total, market) => total + (Number(market.volume) || 0),
    0
  );

  return result;
};

export const calculateHypeLiquidity = (
  marketResponse: MainMarket | undefined,
  currentMarket: Market | null
): number => {
  if (marketResponse?.type === MarketType.POOL) {
    return marketResponse.markets.reduce((total, market) => {
      const hypeLiquidity = Number(market.hypeLiquidity) || 0;
      return total + hypeLiquidity;
    }, 0);
  }
  const hypeLiquidity = Number(currentMarket?.hypeLiquidity) || 0;
  return hypeLiquidity;
};

export const calculateLiquidity = (
  marketResponse: MainMarket | undefined,
  currentMarket: Market | null
): number => {
  if (marketResponse?.type === MarketType.POOL) {
    return marketResponse.markets.reduce((total, market) => {
      const hypeLiquidity = Number(market.hypeLiquidity) || 0;
      const flopLiquidity = Number(market.flopLiquidity) || 0;
      return total + hypeLiquidity + flopLiquidity;
    }, 0);
  }
  const hypeLiquidity = Number(currentMarket?.hypeLiquidity) || 0;
  const flopLiquidity = Number(currentMarket?.flopLiquidity) || 0;
  return hypeLiquidity + flopLiquidity;
};
