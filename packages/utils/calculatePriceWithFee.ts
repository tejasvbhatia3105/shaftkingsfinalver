export function calculatePriceWithFee(
  bps: number,
  currentPrice: number,
  isBuy: boolean
) {
  const feeDecimal = bps / 10_000;
  const priceSpread = 1 - currentPrice;

  const fee = feeDecimal * priceSpread;
  const finalPrice = isBuy ? currentPrice - fee : currentPrice + fee;

  return Number(finalPrice);
}
