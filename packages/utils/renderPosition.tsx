import { Direction } from '@/types/market';
import { cn } from './cn';
import { Geoform } from './fonts';

const commonClasses =
  'flex w-fit h-[18px] min-w-9 items-center justify-center gap-x-0.5 rounded-[2px] px-1 text-[11px] font-medium rounded-[2px]';
const hypeClasses = 'bg-shaftkings-green-200/10 text-shaftkings-green-200';
const flopClasses = 'bg-shaftkings-red-200 bg-opacity-10 text-shaftkings-red-300';

export const renderPosition = (position: Direction) => {
  switch (position) {
    case Direction.HYPE:
      return (
        <span
          className={cn(`${commonClasses} ${hypeClasses}`, Geoform.className)}
        >
          Yes
        </span>
      );

    case Direction.FLOP:
      return (
        <span
          className={cn(`${commonClasses} ${flopClasses}`, Geoform.className)}
        >
          No
        </span>
      );
    default:
      return (
        <span
          className={cn(`${commonClasses} ${flopClasses}`, Geoform.className)}
        >
          No
        </span>
      );
  }
};
