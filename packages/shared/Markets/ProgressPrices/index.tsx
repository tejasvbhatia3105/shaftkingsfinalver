import { useMemo } from 'react';

type ProgressPricesProps = {
  hypePrice: number;
  flopPrice: number;
};

const ProgressPrices: React.FC<ProgressPricesProps> = ({
  hypePrice,
  flopPrice,
}) => {
  const progressBars = useMemo(() => {
    const total = Number(hypePrice) + Number(flopPrice);
    const hypePercentage = total > 0 ? (hypePrice / total) * 100 : 0;
    const flopPercentage = total > 0 ? (flopPrice / total) * 100 : 0;

    return [
      {
        label: 'Hype',
        percentage: hypePercentage,
        classNames: 'rounded-l bg-shaftkings-green-200',
      },
      {
        label: 'Flop',
        percentage: flopPercentage,
        classNames: 'rounded-r bg-shaftkings-red-200',
      },
    ];
  }, [hypePrice, flopPrice]);

  return (
    <div className="flex size-full h-10 flex-col items-center gap-y-1.5">
      <div className="flex w-full items-center justify-between">
        <span className="font-semibold text-black dark:text-white">
          {progressBars[0].percentage.toFixed(0)}%
        </span>
        <span className="text-[#C0C0C0] text-xs font-medium">Chance</span>
        <span className="font-semibold text-black dark:text-white">
          {progressBars[1].percentage.toFixed(0)}%
        </span>
      </div>

      <div className="relative z-10 flex w-full gap-x-0.5 rounded">
        {progressBars.map((item) => (
          <div
            key={item.label}
            className={`h-1 ${item.classNames}`}
            style={{ width: `${item.percentage}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ProgressPrices;
