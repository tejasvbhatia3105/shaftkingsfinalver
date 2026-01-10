// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prefer-const */

import { useEffect, useMemo, useState } from 'react';
import { useMarket } from '@/context/Market';
import type { Market, OrderBook, TokenTypes, BookOrder } from '@/types/market';
import { formatCents } from '@/utils/formatCents';
import {
  formatCurrency,
  formatNumberToShortScale,
} from '@/utils/formatCurrency';
import { AnimatePresence, motion } from 'framer-motion';

const PotentialProfit = ({
  mainMarket,
  selectedToken,
  value,
  shares,
  orderBook,
}: {
  mainMarket: Market;
  selectedToken: TokenTypes;
  value: number;
  shares: number;
  orderBook: OrderBook;
}) => {
  const {
    selectedOption,
    selectedTradeOption,
    selectedMarket,
    selectedBuySellTab,
  } = useMarket();
  const [loading, setLoading] = useState<boolean>();
  const isBuy = selectedBuySellTab === 0;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [selectedToken, selectedOption]);

  const netAmount = useMemo(() => {
    return value;
  }, [value]);

  const calculate = useMemo(() => {
    const { flopLiquidity, hypeLiquidity, hypePrice, flopPrice } = mainMarket;

    if (netAmount <= 0) {
      return { priceImpact: 0, totalShares: 0 };
    }

    const isHypeSelected = selectedOption === 'Yes';
    const DECIMALS = 10 ** 6;
    const MAX_PRICE = 0.999999;
    const MIN_PRICE = 0.000001;

    const currentLiquidity =
      (isHypeSelected ? Number(hypeLiquidity) : Number(flopLiquidity)) /
      DECIMALS;

    const currentPrice = isHypeSelected ? Number(hypePrice) : Number(flopPrice);

    const adjustedNetAmount = netAmount;

    const liquidity_ratio = adjustedNetAmount / (currentLiquidity + 1.0);
    const impact_factor = 1.0 + Math.sqrt(liquidity_ratio);
    let orderPrice = currentPrice * impact_factor;

    const takerFee = 1.01;
    orderPrice = Math.max(
      MIN_PRICE,
      Math.min(MAX_PRICE, orderPrice * takerFee)
    );

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const shares = adjustedNetAmount / orderPrice;
    const finalPriceImpact = Math.min(
      ((orderPrice - currentPrice) / currentPrice) * 100,
      99.99
    );

    return {
      priceImpact: finalPriceImpact,
      totalShares: shares,
      orderPrice,
    };
  }, [mainMarket, netAmount, selectedOption]);

  function calculateAvgExecutionPriceFromBook(
    bookOrders: BookOrder[],
    usdcAmount: number,
    feeBps: number
  ) {
    let remainingUSDC = usdcAmount;
    let totalShares = 0;
    let totalCost = 0;

    const sortedAsks = [...bookOrders]
      .map((order) => {
        const price = parseFloat(order.price) / 1_000_000;
        const availableShares =
          (parseFloat(order.totalShares) - parseFloat(order.filledShares)) /
          1_000_000;
        return { price, availableShares };
      })
      .filter((o) => o.availableShares > 0)
      .sort((a, b) => a.price - b.price);

    for (const { price, availableShares } of sortedAsks) {
      let adjustedPrice = price;
      if (feeBps > 0) {
        const priceSpread = 1 - price;
        const fee = priceSpread * price * (feeBps / 10_000);
        adjustedPrice += fee;
      }

      const costAtThisLevel = availableShares * adjustedPrice;

      if (remainingUSDC >= costAtThisLevel) {
        totalShares += availableShares;
        totalCost += costAtThisLevel;
        remainingUSDC -= costAtThisLevel;
      } else {
        const sharesToBuy = remainingUSDC / adjustedPrice;
        totalShares += sharesToBuy;
        totalCost += sharesToBuy * adjustedPrice;
        remainingUSDC = 0;
        break;
      }
    }

    if (totalShares === 0) {
      return {
        averagePrice: 0,
        totalShares: 0,
        payout: 0,
      };
    }

    return {
      averagePrice: totalCost / totalShares,
      totalShares,
      payout: totalShares * 1,
    };
  }

  function calculateSellExecutionFromBook(
    bookOrders: BookOrder[],
    sharesToSell: number,
    feeBps: number
  ) {
    let remainingShares = sharesToSell;
    let totalUSDC = 0;

    const sortedBids = [...bookOrders]
      .map((order) => {
        const price = parseFloat(order.price) / 1_000_000;
        const availableShares =
          (parseFloat(order.totalShares) - parseFloat(order.filledShares)) /
          1_000_000;
        return { price, availableShares };
      })
      .filter((o) => o.availableShares > 0)
      .sort((a, b) => b.price - a.price); // Sort bids in descending order (highest price first)

    for (const { price, availableShares } of sortedBids) {
      let adjustedPrice = price;
      if (feeBps > 0) {
        const priceSpread = 1 - price;
        const fee = priceSpread * price * (feeBps / 10_000);
        adjustedPrice -= fee; // Subtract fee for sells
      }

      if (remainingShares >= availableShares) {
        totalUSDC += availableShares * adjustedPrice;
        remainingShares -= availableShares;
      } else {
        totalUSDC += remainingShares * adjustedPrice;
        remainingShares = 0;
        break;
      }
    }

    if (totalUSDC === 0) {
      return {
        averagePrice: 0,
        totalShares: 0,
        payout: 0,
      };
    }

    return {
      averagePrice: totalUSDC / (sharesToSell - remainingShares),
      totalShares: sharesToSell - remainingShares,
      payout: totalUSDC,
    };
  }
  const getMarketExecutionData = () => {
    const orderBookSide = orderBook[selectedOption === 'Yes' ? 'hype' : 'flop'];
    const feeBps = Number(selectedMarket?.feeBps) || 0;

    if (isBuy) {
      return calculateAvgExecutionPriceFromBook(
        orderBookSide.ask,
        value,
        feeBps
      );
    }
    return calculateSellExecutionFromBook(orderBookSide.bid, value, feeBps);
  };

  const getAveragePriceText = () => {
    if (selectedTradeOption !== 'Market') {
      return `Total: ${formatCurrency(shares * value)}`;
    }

    if (Number(selectedMarket?.id) > 310) {
      const executionData = getMarketExecutionData();
      return `Avg. Price: ${formatCents(executionData.averagePrice)}`;
    }

    return `Avg. Price: ${formatCents(Number(calculate.orderPrice || 0))
      .toString()
      .slice(0, 6)}`;
  };

  const getPayoutValue = () => {
    if (selectedTradeOption === 'Market') {
      const executionData = getMarketExecutionData();
      return formatNumberToShortScale(executionData.payout, 0, true);
    }

    return formatNumberToShortScale(shares, 0, true);
  };

  const shouldShow = value > 0;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className="mt-4 flex h-auto flex-col gap-y-2 rounded-lg"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{ overflow: 'hidden' }}
        >
          <div className="flex h-[67px] w-full items-center justify-between rounded-[1px] border border-black/10 bg-transparent px-4 py-5 dark:bg-white/5">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-black dark:text-white">
                Potential payout
              </span>

              <span className="mt-[2px] text-xs font-medium text-shaftkings-gray-400 dark:text-shaftkings-dark-150">
                {getAveragePriceText()}
              </span>
            </div>

            {loading ? (
              <div className="animate-loading h-6 w-16 rounded" />
            ) : (
              <span className="text-2xl font-bold text-shaftkings-green-200">
                {getPayoutValue()}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PotentialProfit;
