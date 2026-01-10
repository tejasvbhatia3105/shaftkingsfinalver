import { useEffect, useState } from 'react';

type ProgressBarProps = {
  total: number;
  currentValue: number;
  firstLabel?: string;
  secondLabel?: string;
  color?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  total,
  currentValue,
  firstLabel,
  secondLabel,
  color,
}) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const percentage = Math.min((currentValue / total) * 100, 100);

  useEffect(() => {
    setAnimatedWidth(percentage);
  }, [percentage]);

  return (
    <div className="flex w-full flex-col items-start">
      <div className="h-2 w-full rounded-[2px] bg-white/10">
        <div
          className="h-full rounded-[2px] transition-all duration-700 ease-in-out"
          style={{
            width: `${animatedWidth}%`,
            backgroundColor: color || '#EE5F67',
          }}
        />
      </div>

      <div
        style={{ color: color || '#EE5F67 ' }}
        className="mt-1 flex w-full justify-between text-xs font-medium"
      >
        <span>{firstLabel}</span>
        <span className="text-[#C0C0C0]">{secondLabel}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
