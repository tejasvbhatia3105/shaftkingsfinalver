import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/utils/cn';

export type TimeFilter = '1h' | '6h' | '1d' | '7d' | '30d' | 'All Time';

const TimeTabs = ({
  timeRange,
  handleTimeRangeChange,
}: {
  timeRange: TimeFilter;
  handleTimeRangeChange: (timeRange: TimeFilter) => void;
}) => {
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

  const timeList = useMemo(() => {
    const timeRangeList = ['1h', '6h', '1d', '7d', '30d', 'All Time'];
    return isMobile ? ['1h', '6h', '1d', '7d', '30d', 'All'] : timeRangeList;
  }, [isMobile]);

  return (
    <div className="flex w-fit items-center rounded-lg border border-black/10 bg-white/5 p-[4px] dark:border-transparent">
      {timeList.map((range) => {
        const label = range;
        const isAll = range === 'All';
        const isActive =
          timeRange === range || (isAll && timeRange === 'All Time');

        return (
          <div key={label}>
            <button
              className={cn(
                'min-h-[30px] min-w-[53px] rounded-[1px] text-xs font-medium px-4 flex items-center justify-center leading-[12px]',
                isActive
                  ? 'bg-shaftkings-gold-200 !text-black'
                  : 'bg-transparent text-shaftkings-gray-400 dark:text-[#C0C0C0]'
              )}
              onClick={() =>
                handleTimeRangeChange(
                  isAll ? 'All Time' : (range as TimeFilter)
                )
              }
            >
              {label}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TimeTabs;
