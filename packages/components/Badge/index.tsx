import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { IconArrow } from '../Icons';

type BadgeProps = {
  value: number;
  disableBackground?: boolean;
  className?: string;
  isArrowActive?: boolean;
  arrowPosition?: 'left' | 'right';
  hasDollar?: boolean;
  hasPercentage?: boolean;
  plus?: boolean;
};

const Badge: React.FC<BadgeProps> = ({
  value,
  className,
  disableBackground,
  isArrowActive,
  arrowPosition,
  hasDollar,
  hasPercentage,
  plus = true,
}) => {
  return (
    <span
      className={cn(
        'h-fit w-fit text-xs lg:text-sm font-medium p-1 bg-opacity-10 rounded flex items-center',
        {
          'bg-shaftkings-green-100 text-shaftkings-green-200': value >= 0,
          'bg-shaftkings-red-400/10 text-shaftkings-red-400': value < 0,
          'bg-white': disableBackground,
          'flex-row-reverse': arrowPosition === 'left',
        },
        className
      )}
    >
      <span>
        <span>{plus && value > 0 && '+'}</span>
        {hasDollar ? formatCurrency(value) : Number(value).toFixed(2)}

        <span>{hasPercentage && '%'}</span>
      </span>

      {isArrowActive && (
        <IconArrow
          className={cn('arrow-pnl-icon', {
            'transform rotate-180 fill-shaftkings-green-200': value >= 0,
            ' fill-shaftkings-red-400': value < 0,
          })}
        />
      )}
    </span>
  );
};

export default Badge;
