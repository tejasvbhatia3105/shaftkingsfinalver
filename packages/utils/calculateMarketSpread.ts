export function calcMarketSpread(
  marketTickerData: { positionsHype: number; positionsFlop: number },
  hypePrice: number,
  flopPrice: number
) {
  if (!marketTickerData || hypePrice === undefined || flopPrice === undefined) {
    return { positivePercent: 0, negativePercent: 0 };
  }

  const totalPrice = hypePrice + flopPrice;

  if (totalPrice === 0) {
    return { positivePercent: 0, negativePercent: 0 };
  }

  const positivePercent = ((hypePrice / totalPrice) * 100).toFixed(1);
  const negativePercent = ((flopPrice / totalPrice) * 100).toFixed(1);

  return { positivePercent, negativePercent };
}
