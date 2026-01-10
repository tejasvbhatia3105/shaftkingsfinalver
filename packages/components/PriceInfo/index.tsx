import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import type { ReactNode } from 'react';
import Badge from '../Badge';

function PriceInfo({
  label,
  price,
  badgeValue,
  index,
  valueClass = 'text-base',
}: {
  label: string | ReactNode;
  index: number;
  price: number | string;
  badgeValue: number;
  valueClass?: string;
}) {
  return (
    <div
      className={cn(
        'flex h-full flex-col items-center gap-y-1 py-3',
        index === 1 ? 'items-end' : 'items-start'
      )}
    >
      <span className="text-xs text-shaftkings-dark-100/80 dark:text-[#C0C0C0]">
        {label}
      </span>
      <h4
        className={`${valueClass} whitespace-nowrap font-medium text-shaftkings-dark-100 dark:text-white`}
      >
        {formatCurrency(Number(price))?.replace('$', '')} TRD
      </h4>
      <Badge
        className={cn(
          'h-6 rounded-[1px] !text-xs',
          label === 'Flop Price' && 'ml-auto'
        )}
        value={badgeValue}
        hasPercentage={true}
      />
    </div>
  );
}

export function PricesList({
  prices,
}: {
  prices: Array<{
    label: string | ReactNode;
    price: number | string;
    badgeValue: number;
  }>;
}) {
  return (
    <div className="flex w-full items-center justify-between">
      {prices.map((priceData, idx) => (
        <PriceInfo
          key={idx}
          label={priceData.label}
          index={idx}
          price={priceData.price}
          badgeValue={priceData.badgeValue}
        />
      ))}
    </div>
  );
}
