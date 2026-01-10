import { cn } from '@/utils/cn';
import { getColorByProbability } from '@/utils/getColorByProbability';

type CardAwardProps = {
  name: string;
  image: string;
  probability?: string;
  isBigPrize?: boolean;
  className?: {
    container?: string;
    image?: string;
    names?: string;
  };
  availableQuantity?: number;
  quantity?: number;
};

const CardAward: React.FC<CardAwardProps> = ({
  name,
  image,
  probability,
  className,
  isBigPrize,
  availableQuantity,
  quantity,
}) => {
  const colorClass = getColorByProbability(
    Number(probability?.replace(',', '.')) || 0
  );

  return (
    <div
      style={{
        borderColor: `${colorClass}CC`,
        background: `radial-gradient(ellipse, ${colorClass}40  0%, transparent 30%)`,
      }}
      className={cn(
        'relative flex w-full h-full min-h-[100px] flex-col items-center rounded-[1px] border bg-transparent p-1.5',
        {
          'opacity-50': availableQuantity === 0,
        },
        className?.container
      )}
    >
      {quantity && (
        <div className="absolute left-0 top-0 flex items-center justify-center rounded-r bg-white/10 p-1.5 pr-3 text-white">
          {quantity}
        </div>
      )}

      {probability && (
        <div className="absolute right-0 top-0 flex flex-col items-end rounded-br-md rounded-tl-md p-1 pr-1.5 pt-0.5 text-[9px] font-medium text-[#C0C0C0]">
          Chance
          <span className="text-[10px] font-bold leading-[9px]">
            {Number(probability.replace(',', '.')) < 0.01
              ? probability.replace(',', '.')
              : Number(probability.replace(',', '.')).toFixed(2)}
            %
          </span>
        </div>
      )}

      {isBigPrize && (
        <h4 className="text-center text-xs font-bold tracking-wider text-white">
          💘 BIG PRIZE
        </h4>
      )}
      <div
        className={cn('flex flex-col h-full items-center gap-y-1.5', {
          'mt-5': !isBigPrize,
        })}
      >
        <img
          width={32}
          height={32}
          src={image}
          alt=""
          className={cn(
            'size-8 mt-2 rounded-full object-cover',
            className?.image
          )}
        />
        <div>
          <span
            className={cn(
              'text-[11px] font-bold text-center text-white leading-3 flex',
              className?.names
            )}
          >
            {name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardAward;
