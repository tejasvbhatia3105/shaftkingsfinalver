// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-shadow */
import { useMarket } from '@/context/Market';
import { cn } from '@/utils/cn';
import { formatCents } from '@/utils/formatCents';
import { getTeamColors } from '@/utils/getColors';
import { useEffect, useState } from 'react';

type ToggleButtonProps = {
  className?: string;
  firstButtonText: string;
  secondButtonText: string;
  isBuy: boolean;
  setValue?: (value: number) => void;
  yesPrice: number;
  noPrice: number;
};

export function ToggleButton({
  className,
  firstButtonText,
  secondButtonText,
  setValue,
  yesPrice,
  noPrice,
}: ToggleButtonProps) {
  const { setSelectedOption, selectedOption, selectedMarket } = useMarket();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setIsMobile(windowWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const handleClick = (buttonText: string) => {
    setSelectedOption(buttonText);
  };

  return (
    <div
      className={cn(
        'w-full min-h-[46px] font-medium gap-x-3 flex',
        {
          'justify-end': selectedOption === 'Yes',
          'justify-start': selectedOption === 'No',
        },
        className
      )}
    >
      <button
        style={{
          backgroundColor:
            selectedOption === 'Yes' ||
            selectedOption === selectedMarket?.yesSideName
              ? getTeamColors('Yes')?.primary
              : undefined,
        }}
        onClick={() => {
          handleClick('Yes');
          if (!setValue) return;
          setValue(yesPrice);
        }}
        className={cn(
          'w-1/2 min-h-full rounded-[1px] !capitalize bg-bg-black/5 dark:bg-white/5  text-[#C0C0C0]',
          {
            'text-white': selectedOption === 'Yes',
          }
        )}
      >
        {firstButtonText} <span>{formatCents(Number(yesPrice)) || 0}</span>
      </button>
      <button
        style={{
          backgroundColor:
            selectedOption === 'No' ||
            selectedOption === selectedMarket?.noSideName
              ? getTeamColors('No')?.primary
              : undefined,
        }}
        onClick={() => {
          handleClick('No');
          if (!setValue) return;
          setValue(noPrice);
        }}
        className={cn('w-1/2 min-h-full rounded-[1px]', {
          'bg-bg-black/5 dark:bg-white/5 text-[#C0C0C0]':
            selectedOption !== 'No',
          ' text-white': selectedOption === 'No',
        })}
      >
        {secondButtonText} <span>{formatCents(Number(noPrice)) || 0}</span>
      </button>
    </div>
  );
}
