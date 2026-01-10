/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-shadow */
import type { Market } from '@/types/market';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import { CheckIcon, CloseCircleIcon } from '../Icons';

type RenderOutcomeProps = {
  className?: string;
  market: Market;
  agregattes: Market[] | undefined;
};

const RenderOutcome: React.FC<RenderOutcomeProps> = ({
  market,
  className,
  agregattes,
}) => {
  if (market?.winningDirection !== 'None') {
    let outcomeStyle = '';
    let outcomeText = '';

    switch (market?.winningDirection) {
      case 'Hype':
        outcomeStyle = 'bg-shaftkings-green-200/10 text-shaftkings-green-200';
        outcomeText = 'Yes';
        break;
      case 'Flop':
        outcomeStyle = 'bg-shaftkings-red-300/10 text-shaftkings-red-300';
        outcomeText = 'No';
        break;
      case 'Draw':
        outcomeStyle = 'bg-shaftkings-gray-600 text-[#C0C0C0]';
        outcomeText = 'Draw';
        break;
      default:
        break;
    }

    if (market?.poolId) {
      return (
        <div className="flex size-full max-h-[90px] flex-col items-center justify-center gap-y-1 overflow-y-auto">
          {agregattes?.map((market) => {
            return (
              <div
                key={market.id}
                className="flex h-[24px] w-full items-center justify-between"
              >
                <h3 className="flex w-3/5 items-center gap-x-2 truncate whitespace-nowrap text-sm font-medium text-shaftkings-dark-100 dark:text-[#C0C0C0]">
                  <Image
                    className="size-4 object-cover"
                    width={16}
                    height={16}
                    src={market.image}
                    alt=""
                  />
                  {market.question}
                </h3>
                <div className={cn('flex items-center gap-x-1 min-w-[45px]')}>
                  {market.winningDirection === 'Hype' ? (
                    <CheckIcon />
                  ) : (
                    <CloseCircleIcon />
                  )}
                  <span
                    className={cn('text-xs', {
                      'text-shaftkings-green-200':
                        market.winningDirection === 'Hype',
                      'text-shaftkings-red-400':
                        market.winningDirection === 'Flop' ||
                        market.winningDirection === 'Draw',
                    })}
                  >
                    {market.winningDirection === 'Hype'
                      ? market.yesSideName
                      : market.noSideName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div
        className={cn(
          'flex min-h-[4px] w-full items-center justify-center rounded py-2.5 text-sm font-semibold',
          outcomeStyle,
          className
        )}
      >
        Outcome:{' '}
        <span className={cn('ml-1')}>
          {market.winningDirection === 'Draw'
            ? outcomeText
            : market.winningDirection === 'Hype'
            ? market.yesSideName
            : market.noSideName}
        </span>
      </div>
    );
  }

  return null;
};

export default RenderOutcome;
