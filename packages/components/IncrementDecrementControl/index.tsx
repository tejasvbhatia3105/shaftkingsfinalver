import type { TokenTypes } from '@/types/market';
import { cn } from '@/utils/cn';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

const IncrementDecrementControl = ({
  selectedToken,
  value,
  setValue,
  hasCents,
  initialFontSize,
  showSelectedToken,
  showCurrencyPrefix,
  className,
}: {
  selectedToken?: TokenTypes;
  value: number;
  setValue: (value: number) => void;
  hasCents?: boolean;
  showSelectedToken?: boolean;
  showCurrencyPrefix?: boolean;
  className?: {
    input?: string;
  };
  startSize?: string;
  initialFontSize?: number;
}) => {
  const [, setIsMobile] = useState(false);
  const MAX_VALUE = 1_000_000_000;
  const [inputText, setInputText] = useState('');
  const pathname = usePathname();

  const clampValue = useCallback(
    (val: number) => {
      if (hasCents) return Math.max(0, Math.min(99, Math.floor(val)));
      return Math.max(0, Math.min(MAX_VALUE, val));
    },
    [hasCents]
  );

  const formatNumberWithCommas = useCallback((num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }, []);

  useEffect(() => {
    if ((selectedToken === 'BRL' || selectedToken === 'USDC') && value === 0) {
      setInputText('');
      return;
    }

    if (
      value === 0 &&
      showSelectedToken !== undefined &&
      selectedToken !== 'USDC'
    ) {
      setInputText('');
      return;
    }

    if (selectedToken === 'USDC' && value === 0) {
      setInputText('');
      return;
    }

    if (hasCents || selectedToken !== 'SOL') {
      const display = hasCents
        ? `${clampValue(value)}¢`
        : formatNumberWithCommas(value);

      if (selectedToken === 'USDC') {
        setInputText(`$${display}`);
        return;
      }

      setInputText(showCurrencyPrefix ? `R$${display}` : `${display}`);
    } else {
      setInputText(`${value.toString()}`);
    }
  }, [
    value,
    selectedToken,
    hasCents,
    clampValue,
    formatNumberWithCommas,
    showCurrencyPrefix,
    showSelectedToken,
  ]);

  useEffect(() => {
    const cv = clampValue(value);
    if (cv !== value) setValue(cv);
  }, [value, clampValue, setValue]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const input = e.target;

      if (selectedToken === 'USDC' && !raw.startsWith('$')) {
        const match = raw.match(/^(\d+)$/);
        if (match) {
          const newText = `$${match[1]}`;
          setInputText(newText);
          setValue(Number(match[1]));
          setTimeout(() => {
            input.setSelectionRange(newText.length, newText.length);
          }, 0);
          return;
        }
        setInputText('$');
        setValue(0);
        setTimeout(() => {
          input.setSelectionRange(1, 1);
        }, 0);
        return;
      }

      if (raw === '$' && selectedToken === 'USDC') {
        setInputText('');
        setValue(0);
        return;
      }

      setInputText(raw);

      const clean = raw
        .replace(/\$/g, '')
        .replace(/R\$/g, '')
        .replace(/,/g, '')
        .replace(/[^0-9.]/g, '')
        .replace(/(\..*?)\..*/g, '$1');

      if (!clean || clean === '.') {
        setValue(0);
        return;
      }

      const parsed = parseFloat(clean);
      if (!Number.isNaN(parsed)) {
        setValue(clampValue(parsed));
      }
    },
    [clampValue, selectedToken, setValue]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Bloqueia apenas letras
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        e.preventDefault();
        return;
      }

      if (e.key === ',') {
        e.preventDefault();
        if (inputText.includes('.')) {
          return;
        }
        const newText = `${inputText}.`;
        setInputText(newText);
        return;
      }

      if (
        selectedToken === 'USDC' &&
        e.currentTarget.selectionStart !== null &&
        e.currentTarget.selectionStart <= 1 &&
        (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'ArrowLeft')
      ) {
        e.preventDefault();
        return;
      }

      if (hasCents && e.key === 'Backspace') {
        const newValue = Math.floor(value / 10);
        const clamped = clampValue(newValue);
        setValue(clamped);
        setInputText(clamped.toString());
        e.preventDefault();
      }
    },
    [hasCents, inputText, value, clampValue, setValue]
  );

  const getFontSizeStyle = useCallback(() => {
    const digits = value === 0 ? 1 : Math.floor(Math.log10(value)) + 1;
    const base = initialFontSize || 3;
    const minFontSize = 1.2;
    const reducePerDigit = 0.88;
    const extraDigits = Math.max(0, digits - 4);
    const fontSize = Math.max(
      minFontSize,
      base * reducePerDigit ** extraDigits
    );
    return { fontSize: `${fontSize}rem` };
  }, [value, initialFontSize]);

  const formatInputText = useCallback((val: number) => {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  }, []);

  const handleBlur = useCallback(() => {
    const formatted = formatInputText(value);
    if (!selectedToken) {
      setInputText(`${formatted}`);
      return;
    }

    if (selectedToken === 'USDC') {
      setInputText(`$${formatted}`);
      return;
    }
    setInputText(showCurrencyPrefix ? `R$${formatted}` : `${formatted}`);
  }, [formatInputText, value, selectedToken, showCurrencyPrefix]);

  useEffect(() => {
    if (selectedToken === 'USDC' && value === 0) {
      setInputText('');
      return;
    }

    if (
      !document.activeElement ||
      (document.activeElement as HTMLElement).tagName !== 'INPUT'
    ) {
      const formatted = formatInputText(value);

      if (selectedToken === 'USDC') {
        setInputText(value === 0 ? '' : `$${formatted}`);
        return;
      }
      setInputText(showCurrencyPrefix ? `R$${formatted}` : `${formatted}`);
    }
  }, [value, showCurrencyPrefix, formatInputText, selectedToken]);

  const getInputProps = useMemo(() => {
    const baseProps: React.InputHTMLAttributes<HTMLInputElement> = {
      type: 'text',
      onKeyDown: handleKeyDown,
      onChange: handleInputChange,
      onBlur: handleBlur,
      value: inputText,
      inputMode: hasCents ? 'text' : 'decimal',
      autoComplete: 'off',
      spellCheck: false,
      pattern: '[0-9.,]*',
    };

    return baseProps;
  }, [handleKeyDown, handleInputChange, handleBlur, inputText, hasCents]);

  let inputPlaceholder = '0';
  if (selectedToken === 'BRL') {
    inputPlaceholder = 'R$0';
  } else if (selectedToken === 'USDC') {
    inputPlaceholder = '$0';
  } else if (showCurrencyPrefix) {
    inputPlaceholder = 'R$0';
  }

  return (
    <div
      className={cn(
        'mt-4 flex w-full flex-col items-center bg-transparent lg:mt-3',
        { 'max-sm:mt-0': pathname === '/staking' }
      )}
    >
      <div className="relative my-3 flex h-14 w-full items-center justify-center rounded-lg p-3 text-lg font-semibold text-white lg:my-1">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="relative flex w-full items-center justify-center">
            <input
              className={cn(
                'w-full max-w-full text-center bg-transparent font-bold',
                {
                  'pl-10': showCurrencyPrefix,
                  'dark:text-shaftkings-dark-150/30 text-[#606E85]/30':
                    value === 0,
                  'text-shaftkings-dark-100 dark:text-white': value !== 0,
                },
                className?.input
              )}
              style={getFontSizeStyle()}
              placeholder={inputPlaceholder}
              aria-label="input amount"
              {...getInputProps}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncrementDecrementControl;
