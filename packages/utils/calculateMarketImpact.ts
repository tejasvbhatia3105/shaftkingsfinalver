import type { Market } from '@/types/market';

type CalculateMarketImpactProps = {
  currentMarket: Market;
  netAmount: number;
  selectedOption: string;
};

export const calculateMarketImpact = ({
  currentMarket,
  netAmount,
  selectedOption,
}: CalculateMarketImpactProps) => {
  const { flopLiquidity, hypeLiquidity, hypePrice, flopPrice } = currentMarket;

  if (netAmount <= 0) {
    return { priceImpact: 0, totalShares: 0 };
  }

  const isHypeSelected = selectedOption === 'Hype';
  const DECIMALS = 10 ** 6;
  const MAX_PRICE = 0.999999;
  const MIN_PRICE = 0.000001;

  const currentLiquidity =
    (isHypeSelected ? Number(hypeLiquidity) : Number(flopLiquidity)) / DECIMALS;

  const othersideLiquidity =
    (isHypeSelected ? Number(flopLiquidity) : Number(hypeLiquidity)) / DECIMALS;

  const currentPrice = isHypeSelected ? Number(hypePrice) : Number(flopPrice);

  const newDirectionalLiquidity = currentLiquidity + netAmount;
  const totalLiquidity = newDirectionalLiquidity + othersideLiquidity;

  const newPrice = Math.max(
    MIN_PRICE,
    Math.min(MAX_PRICE, newDirectionalLiquidity / totalLiquidity)
  );

  let orderPrice = Math.max(MIN_PRICE, Math.min(MAX_PRICE, newPrice));

  const takerFee = 1.042;

  orderPrice = Math.max(MIN_PRICE, Math.min(MAX_PRICE, orderPrice * takerFee));

  const shares = netAmount / orderPrice;
  const finalPriceImpact = Math.min(
    ((orderPrice - currentPrice) / currentPrice) * 100,
    99.99
  );

  return {
    priceImpact: finalPriceImpact,
    totalShares: shares,
  };
};
