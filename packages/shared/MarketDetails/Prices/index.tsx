import {
  IconAlreadyCopy,
  IconAttachment,
  IconVolume,
} from '@/components/Icons';
import QuestionDateStatus from '@/components/QuestionDateStatus';
import { WinningDirection } from '@/types/market';
import type { MainMarket, Market } from '@/types/market';
import { calculateVolume } from '@/utils/calculateData';
import { cn } from '@/utils/cn';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { formatCurrency } from '@/utils/formatCurrency';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

type PricesProps = {
  mainMarket: MainMarket;
  selectedMarket: Market | null;
};

const Prices: React.FC<PricesProps> = ({ mainMarket, selectedMarket }) => {
  const pathname = usePathname();
  const [isCopied, setIsCopied] = useState(false);

  const totalVolume = useMemo(() => calculateVolume(mainMarket), [mainMarket]);

  const prices = useMemo(
    () => [
      {
        icon: <IconVolume />,
        label: 'Total Vol:',
        price: (
          <>
            <span>{formatCurrency(totalVolume || 0)}</span>
          </>
        ),
      },
      {
        icon: '',
        label: '',
        price: (
          <QuestionDateStatus
            date={selectedMarket?.marketEnd || ''}
            hasResolved={
              selectedMarket?.winningDirection !== WinningDirection.NONE
            }
          />
        ),
      },
    ],
    [
      totalVolume,
      // triadValue,
      selectedMarket?.marketEnd,
      selectedMarket?.winningDirection,
    ]
  );

  // const percentageValue = useMemo(() => {
  //   return selectedMarket ? selectedMarket.hypePrice * 100 : 0;
  // }, [selectedMarket]);

  const handleCopy = useCallback(() => {
    if (mainMarket?.question) {
      const formattedQuestion = mainMarket.question.replace(/\s+/g, '-');
      const fullPath = `${window.location.origin}${pathname}?question=${formattedQuestion}`;
      copyToClipboard(fullPath);

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [mainMarket?.question, pathname]);

  return (
    <div className="mt-4 flex w-full flex-col-reverse items-end justify-between gap-x-2 md:flex-row lg:mt-[18px] lg:h-auto lg:gap-x-0">
      <div
        className={cn(
          'space-y-4 w-full max-[768px]:flex-wrap lg:items-center lg:gap-x-5'
        )}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full justify-between gap-y-4 max-sm:flex-col-reverse lg:mb-3 lg:flex-row lg:items-center lg:space-y-0">
            <div className="flex items-center">
              {prices.map(({ label, price, icon }) => (
                <div
                  key={label}
                  className={cn(
                    'flex items-center mr-2 whitespace-nowrap text-xs text-[#606E85] dark:text-[#C0C0C0] lg:text-sm'
                  )}
                >
                  <div className="mr-1.5">{icon}</div>
                  <span className="mr-1">{label}</span>
                  <span>{price}</span>
                </div>
              ))}
            </div>
            <div className="right-1 top-5 mb-[30px] flex items-center gap-1 max-sm:absolute lg:mb-0">
              <button
                onClick={handleCopy}
                className="flex size-[30px] items-center justify-center rounded-[1px] hover:bg-white/5"
              >
                {isCopied ? <IconAlreadyCopy /> : <IconAttachment />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prices;
