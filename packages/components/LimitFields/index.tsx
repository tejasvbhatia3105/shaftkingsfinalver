import type { TokenTypes } from '@/types/market';
import { cn } from '@/utils/cn';
import { useCallback, useEffect, useState } from 'react';

type DualIncrementControlProps = {
  value: number | undefined;
  setValue: React.Dispatch<React.SetStateAction<number | undefined>>;
  shares: number;
  setShares: React.Dispatch<React.SetStateAction<number>>;
  selectedToken: TokenTypes;
  className?: string;
  isBuy: boolean;
};

const clampValue = (val: number) => Math.max(0, Math.min(99, val));

const LimitCard: React.FC<DualIncrementControlProps> = ({
  value,
  setValue,
  shares,
  setShares,
  className,
}) => {
  const [priceInput, setPriceInput] = useState(value?.toString() || '');
  const [sharesInput, setSharesInput] = useState(shares.toString());

  const handlePriceIncrement = useCallback(() => {
    setValue((prev) => clampValue((prev ?? 0) + 1));
  }, [setValue]);

  const handlePriceDecrement = useCallback(() => {
    setValue((prev) => {
      if (prev === 1) return 1;
      return clampValue((prev ?? 0) - 1);
    });
  }, [setValue]);

  const handleSharesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const valid = /^[0-9]*[.,]?[0-9]*$/.test(raw);
      if (!valid && raw !== '') return;

      const normalized = raw.replace(',', '.');
      setSharesInput(raw);

      const numValue = parseFloat(normalized);
      if (!Number.isNaN(numValue)) {
        setShares(numValue);
      }
    },
    [setShares]
  );

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value;

      raw = raw.replace(/,/g, '.');

      const valid = /^[0-9]*\.?[0-9]*$/.test(raw);

      if (!valid && raw !== '') return;

      const parts = raw.split('.');

      if (parts.length === 2) {
        parts[1] = parts[1].slice(0, 1);
        raw = `${parts[0]}.${parts[1]}`;
      }

      if (raw === '' || raw.startsWith('0') || parseFloat(raw) < 1) {
        setValue(1);
        setPriceInput('1');
        return;
      }

      if (parseFloat(raw) >= 100) return;

      setPriceInput(raw);

      const parsed = parseFloat(raw);
      if (!Number.isNaN(parsed)) {
        setValue(clampValue(parsed));
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (value !== undefined) {
      setPriceInput(value.toString());
    }
  }, [value]);

  useEffect(() => {
    setSharesInput(shares.toString());
  }, [shares]);

  return (
    <div className={cn('flex mt-3 lg:mt-3.5 flex-col', className)}>
      {/* Price input */}
      <div className="mb-2.5 rounded-lg border border-black/10 p-0 focus-within:border-2 focus-within:border-shaftkings-gray-400 dark:border-white/10 focus-within:dark:border-shaftkings-dark-150">
        <div className="flex h-full max-h-12 items-center justify-between p-4">
          <span className="text-xs font-semibold text-shaftkings-dark-100 dark:text-white">
            Limit Price
          </span>
          <div className="ml-auto flex w-fit items-center">
            <button
              onClick={handlePriceDecrement}
              className="flex size-2.5 items-center justify-center text-sm font-bold text-black dark:text-white"
            >
              −
            </button>
            <div className="mx-2 text-2xl font-bold text-black dark:text-white">
              <div className="relative flex items-center">
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  className="w-full max-w-20 bg-transparent pr-5 text-right text-lg font-semibold text-black focus:outline-none dark:text-white"
                  value={priceInput}
                  onChange={handlePriceChange}
                  aria-label="Price in cents"
                />
                <span className="absolute right-2 text-lg font-semibold text-black dark:text-white">
                  ¢
                </span>
              </div>
            </div>
            <button
              onClick={handlePriceIncrement}
              className="flex size-2.5 items-center justify-center text-sm font-bold text-black dark:text-white"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Shares input */}
      <div className="flex size-full max-h-12 items-center justify-between rounded-lg border border-black/10 p-4 focus-within:border-2 focus-within:border-shaftkings-gray-400 dark:border-white/10 focus-within:dark:border-shaftkings-dark-150">
        <div className="flex w-full items-center justify-between">
          <span className="text-xs font-semibold text-shaftkings-dark-100 dark:text-white">
            Amount
          </span>
          <div className="flex items-center">
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              className="w-24 bg-transparent text-right text-lg font-semibold text-black focus:outline-none dark:text-white"
              value={sharesInput}
              onChange={handleSharesChange}
              aria-label="Number of shares"
            />

            <span className="ml-2 text-xs font-medium text-shaftkings-gray-600 dark:text-gray-400">
              Shares
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LimitCard;
