import type { Order } from '@/types/market';
import { Direction } from '@/types/market';

const calculatePnl = (
  market: {
    hypeLiquidity: string | number;
    hypePrice: string | number;
    flopLiquidity: string | number;
    flopPrice: string | number;
  },
  order: Order
) => {
  if (!market) return 0;

  if (order.price === 0) return 0;

  let currentLiquidity = 0;
  let currentPrice = 0;

  if (order.orderDirection === Direction.HYPE) {
    currentLiquidity = Number(market.hypeLiquidity) / 10 ** 6;
    currentPrice = Number(market.hypePrice) / 10 ** 6;
  } else {
    currentLiquidity = Number(market.flopLiquidity) / 10 ** 6;
    currentPrice = Number(market.flopPrice) / 10 ** 6;
  }

  const shares = order.shares / 10 ** 6;

  let payout = shares * currentPrice;

  const newLiquidity = currentLiquidity - payout;

  const liquidityRatio = payout / (newLiquidity + 1);
  const impactFactor = 1.0 - Math.sqrt(liquidityRatio);

  const newImpactPrice = currentPrice * impactFactor;

  const orderPrice = newImpactPrice / 1.05;

  payout = shares * orderPrice;

  const priceDiffPnl = Number(currentPrice) - order.price / 10 ** 6;

  const isUSDCMarket = Number(order.marketId) > 310;

  const finalPnl = isUSDCMarket
    ? priceDiffPnl * shares * 10 ** 6
    : payout - order.amount;

  return finalPnl;
};

export default calculatePnl;
