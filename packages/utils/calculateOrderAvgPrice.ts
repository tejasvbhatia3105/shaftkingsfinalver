import type { BookOrder } from '@/types/market';

export const calculateOrderAvgPrice = (
  orderBook: { ask: BookOrder[] },
  amountToBuy: number,
  wallet: string
) => {
  let remainingAmount = amountToBuy;
  let totalCost = 0;
  let totalSharesBought = 0;
  let availableAmount = 0;

  const sortedAsks = [...orderBook.ask]
    .sort((a, b) => Number(a.price) - Number(b.price))
    .filter((item) => item.authority !== wallet);

  for (const order of sortedAsks) {
    const orderPrice = Number(order.price);
    const orderAmount = Number(order.totalShares);

    availableAmount += orderAmount;

    if (remainingAmount > 0) {
      const buyAmount = Math.min(remainingAmount, orderAmount);
      totalCost += buyAmount * orderPrice;
      totalSharesBought += buyAmount;
      remainingAmount -= buyAmount;
    }
  }

  const avgPrice = totalSharesBought > 0 ? totalCost / totalSharesBought : 0;

  return {
    avgPrice,
    availableAmount,
  };
};
