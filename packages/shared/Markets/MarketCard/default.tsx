import Countdown from '@/components/Countdown';
import { useMarket } from '@/context/Market';
import type { Market } from '@/types/market';
import { calculateMarketImpact } from '@/utils/calculateMarketImpact';
import { cn } from '@/utils/cn';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import ProgressPrices from '../ProgressPrices';

const DefaultCardView: React.FC<{ market: Market }> = ({ market }) => {
  const { hypePrice, flopPrice, marketStart } = market;
  const { calculatePotentialProfit, setSelectedOption } = useMarket();
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const router = useRouter();
  const TAKER_FEE = 1.042;

  const amountInTRD = useMemo(() => {
    const result = 100 / 1 - TAKER_FEE;
    return result;
  }, []);

  const potentialProfit = useMemo(() => {
    if (!hoveredOption || amountInTRD <= 0) return null;

    const { totalShares } = calculateMarketImpact({
      currentMarket: market,
      netAmount: amountInTRD,
      selectedOption: hoveredOption,
    });

    const profitInTRD = calculatePotentialProfit(
      amountInTRD,
      totalShares,
      market,
      hoveredOption
    );

    return (profitInTRD || 0) * 1;
  }, [calculatePotentialProfit, hoveredOption, market, amountInTRD]);

  const isMarketActive = useMemo(() => {
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= Number(marketStart);
  }, [marketStart]);

  const handleRoutePush = useCallback(() => {
    setSelectedOption(hoveredOption || 'Yes');
    router.push(`/market/${market.id}`);
  }, [hoveredOption, market.id, setSelectedOption, router]);

  return (
    <div className="mt-3 flex w-full flex-col items-center justify-center">
      <ProgressPrices hypePrice={hypePrice} flopPrice={flopPrice} />

      <div className="mt-1.5 flex w-full items-center gap-2">
        {isMarketActive ? (
          [market.yesSideName || 'Yes', market.noSideName || 'No'].map(
            (option, index) => (
              <button
                key={option}
                onClick={handleRoutePush}
                className={cn(
                  'w-full flex text-sm font-semibold items-center justify-center rounded-[1px] h-9 flex-1 transition-all duration-300 ease-in-out',
                  // eslint-disable-next-line no-nested-ternary
                  hoveredOption === option && potentialProfit !== null
                    ? index === 0
                      ? 'bg-shaftkings-green-200 dark:bg-shaftkings-green-200 text-white'
                      : 'bg-shaftkings-red-200 dark:bg-shaftkings-red-200 text-white'
                    : index === 0
                    ? 'hover:bg-shaftkings-green-200 bg-shaftkings-green-200/10 text-shaftkings-green-200 dark:text-shaftkings-green-200'
                    : 'hover:bg-shaftkings-red-200 bg-shaftkings-red-200/10 text-shaftkings-red-200 dark:text-shaftkings-red-200'
                )}
                onMouseEnter={() => setHoveredOption(option)}
                onMouseLeave={() => setHoveredOption(null)}
              >
                {/* {hoveredOption === option && potentialProfit !== null
                  ? `$100 -> $${Number(
                      Math.floor(Number(potentialProfit))
                        .toString()
                        .replace('.00', '')
                    )}`
                  : ` Buy ${option}`} */}
                {` Buy ${option}`}
              </button>
            )
          )
        ) : (
          <Countdown
            target={Number(market.marketStart)}
            countdownEnd={() => {}}
            className="flex h-9 w-full items-center justify-center rounded-[1px] uppercase"
          />
        )}
      </div>
    </div>
  );
};

export default DefaultCardView;
