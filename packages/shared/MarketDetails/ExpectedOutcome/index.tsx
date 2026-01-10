import { useMarket } from '@/context/Market';
import type { Market } from '@/types/market';
import { cn } from '@/utils/cn';
import { PermanentMarker } from '@/utils/fonts';
import { formatNumberToShortScale } from '@/utils/formatCurrency';
import { useEffect, useMemo, useState } from 'react';

type Outcome = {
  label: string;
  price: number;
  shares: string;
  color: string;
  bgColor: string;
  percentage: number;
  align: 'start' | 'end';
};

const ExpectedOutcome: React.FC<{ market: Market }> = ({ market }) => {
  const { hypePrice, flopPrice, flopShares, hypeShares } = market;
  const { selectedMarket } = useMarket();
  const [loadingShares, setLoadingShares] = useState(true);

  useEffect(() => {
    setLoadingShares(true);
    const timeout = setTimeout(() => setLoadingShares(false), 600);
    return () => clearTimeout(timeout);
  }, [selectedMarket]);

  const total = useMemo(() => hypePrice + flopPrice, [hypePrice, flopPrice]);

  const outcomes = useMemo<Outcome[]>(
    () => [
      {
        label: 'Yes',
        price: hypePrice,
        shares: hypeShares,
        color: 'text-[#00B471]',
        bgColor: 'bg-[#00B471]',
        percentage: total > 0 ? (hypePrice / total) * 100 : 0,
        align: 'start',
      },
      {
        label: 'No',
        price: flopPrice,
        shares: flopShares,
        color: 'text-[#EE5F67]',
        bgColor: 'bg-[#EE5F67]',
        percentage: total > 0 ? (flopPrice / total) * 100 : 0,
        align: 'end',
      },
    ],
    [hypePrice, flopPrice, hypeShares, flopShares, total]
  );

  return (
    <div className="flex flex-col">
      <h3 className="mb-1 font-semibold text-shaftkings-dark-100 dark:text-white lg:text-lg">
        Expected Outcome
      </h3>
      <span className="mb-2 text-[13px] font-medium text-[#606E85] dark:text-[#C0C0C0]">
        It reflects the collective sentiment and expectations of participants
        regarding the possible outcome of the event.
      </span>

      <div className="relative z-0 mb-1 flex w-full gap-x-0.5">
        {outcomes.map((outcome, idx) => (
          <div
            key={outcome.label}
            className={cn('h-2', outcome.bgColor, {
              'rounded-l-[2px]': idx === 0,
              'rounded-r-[2px]': idx === 1,
            })}
            style={{ width: `${outcome.percentage}%` }}
          />
        ))}
      </div>

      <div className="flex justify-between text-xs lg:text-base">
        {outcomes.map((outcome) => (
          <div
            key={outcome.label}
            className={cn('flex flex-col gap-1', {
              'items-end': outcome.align === 'end',
            })}
          >
            <span className={cn(outcome.color, PermanentMarker.className)}>
              {outcome.label}
            </span>

            <div
              className={cn(
                'flex items-center font-semibold gap-0.5 lg:gap-2 text-shaftkings-dark-100 dark:text-white',
                {
                  'flex-row-reverse': outcome.align === 'end',
                }
              )}
            >
              <span>{outcome.percentage.toFixed(0)}%</span>
              <div className="mx-1 size-1.5 rounded-full bg-black/15 dark:bg-white/15"></div>
              <div className="text-xs lg:text-base">
                {loadingShares ? (
                  <div className="animate-loading h-5 w-24 rounded-[1px]"></div>
                ) : (
                  <>
                    {formatNumberToShortScale(parseFloat(outcome.shares))}{' '}
                    Shares
                  </>
                )}{' '}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpectedOutcome;
