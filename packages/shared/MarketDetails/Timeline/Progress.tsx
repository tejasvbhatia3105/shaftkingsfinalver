import type { Market, WinningDirection } from '@/types/market';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import Tooltip from '@/components/Tooltip';
import { InfoIcon } from 'lucide-react';
// eslint-disable-next-line no-restricted-imports
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const TimelineProgress: React.FC<{ market: Market }> = ({ market }) => {
  const { marketStart, marketEnd, winningDirection } = market || {};
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio === 1) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      {
        threshold: 1.0,
      }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (componentRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateProgress = useCallback(() => {
    if (!marketStart || !marketEnd) {
      setProgress(0);
      return;
    }

    const start = new Date(Number(marketStart) * 1000).getTime();
    const end = new Date(Number(marketEnd) * 1000).getTime();
    const now = new Date().getTime();

    if (now < start) {
      setProgress(0);
      return;
    }

    if (now >= end && winningDirection === ('None' as WinningDirection)) {
      setProgress(80);
      return;
    }

    if (now >= end || winningDirection !== ('None' as WinningDirection)) {
      setProgress(100);
      return;
    }

    const calcValue = isMobile ? 40 : 70;

    const calculatedProgress = ((now - start) / (end - start)) * calcValue;
    setProgress(calculatedProgress);
  }, [marketStart, marketEnd, winningDirection, isMobile]);

  useEffect(() => {
    if (isInView) {
      calculateProgress();
      const interval = setInterval(calculateProgress, 1000);
      return () => clearInterval(interval);
    }
  }, [isInView, calculateProgress]);

  const styles = {
    progressContainer:
      'h-[3px] w-full rounded-full bg-black/10 dark:bg-white/10 relative',
    progressBar: cn(
      'absolute left-0 h-[3px] rounded-full transition-all duration-500 ease-out',
      {
        'bg-shaftkings-green-200': progress !== 80,
        'bg-yellow-400': progress === 80,
      }
    ),
    progressDot: cn(
      'absolute -top-1.5 w-4 h-4 bg-transparent rounded-full border-2',
      {
        'animate-pulse-scale': progress !== 100,
        'border-shaftkings-green-200': progress !== 80,
        'border-yellow-400': progress === 80,
      }
    ),
    innerDot: cn('absolute min-w-2.5 -top-[3px] min-h-2.5 rounded-full', {
      'bg-shaftkings-green-200': progress !== 80,
      'bg-yellow-400': progress === 80,
    }),
    stepBase:
      'w-4 h-4 rounded-full flex -top-1.5 items-center justify-center transition-all absolute',
    stepCompleted: cn({
      'bg-green-500 text-white': progress !== 80,
      'bg-yellow-400 text-black': progress === 80,
    }),
    stepPending:
      'bg-white dark:bg-[#14151B] border-2 border-black/10 dark:border-white/10',
    labelContainer:
      'mt-4 flex items-center w-full justify-between whitespace-nowrap text-shaftkings-gray-400 dark:text-[#C0C0C0]',
    label:
      'rounded-[2px] bg-black/5 dark:bg-white/[4%] px-1.5 py-0.5 text-center text-[10px] lg:text-[11px] font-medium',
  };

  const steps = useMemo(() => {
    const now = new Date().getTime();

    return [
      {
        id: 1,
        position: 0,
        label: 'Market Start',
        isCompleted: !!marketStart,
      },
      {
        id: 2,
        position: isMobile ? 40 : 70,
        // eslint-disable-next-line no-nested-ternary
        label: marketEnd
          ? isMobile
            ? `Close in ${format(
                new Date(Number(marketEnd) * 1000),
                'MMM dd, HH:mm '
              )}`
            : `Close in ${format(
                new Date(Number(marketEnd) * 1000),
                "MMM dd, yyyy 'at' HH:mm"
              )}`
          : 'Closing date unavailable',
        isCompleted:
          progress >= (isMobile ? 40 : 70) || now >= Number(marketEnd) * 1000,
      },
      {
        id: 3,
        position: 80,
        label:
          winningDirection !== ('None' as WinningDirection)
            ? 'Resolved'
            : 'Resolve Pending',
        isCompleted: winningDirection !== ('None' as WinningDirection),
      },
      {
        id: 4,
        position: isMobile ? 98 : 99,
        label: 'Payout',
        isCompleted:
          winningDirection !== ('None' as WinningDirection) &&
          market.isAllowedToPayout,
      },
    ];
  }, [
    marketStart,
    isMobile,
    marketEnd,
    progress,
    winningDirection,
    market.isAllowedToPayout,
  ]);

  const renderMessageByStep = (step: number, marketData: Market) => {
    switch (step) {
      case 1:
        return `${format(
          new Date(Number(marketData.marketStart) * 1000),
          'MMM dd, yyyy '
        )}`;
      case 2:
        return `${format(
          new Date(Number(marketData.marketEnd) * 1000),
          'MMM dd, yyyy '
        )}`;
      case 3:
        return 'Resolved';
      case 4:
        return `${format(
          new Date(Number(marketData.timestamp) * 1000),
          'MMM dd, yyyy '
        )}`;
      default:
        return '';
    }
  };

  const renderStep = (
    position: number,
    isCompleted: boolean,
    index: number
  ) => {
    const isCurrentStep = progress >= position && progress < position + 10;

    const stepClass = cn(
      styles.stepBase,
      // eslint-disable-next-line no-nested-ternary
      isCompleted
        ? styles.stepCompleted
        : isCurrentStep && progress === 80
        ? 'bg-yellow-400 border-yellow-400'
        : styles.stepPending
    );

    return (
      <div className={stepClass} style={{ left: `calc(${position}%)` }}>
        {isCompleted && (
          <Tooltip
            direction="bottom"
            tooltipMessage={renderMessageByStep(index + 1, market)}
          >
            <InfoIcon className="size-[14px]" />
          </Tooltip>
        )}
      </div>
    );
  };

  return (
    <div
      ref={componentRef}
      className="relative mb-10 mt-5 flex h-4 w-full items-center"
    >
      <div className="relative w-full">
        <div className={styles.progressContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          />
          <div
            className={styles.progressDot}
            style={{ left: `calc(${progress}% - 9px)` }}
          ></div>
          <div
            style={{ left: `calc(${progress}% - 6px)` }}
            className={styles.innerDot}
          />
        </div>

        {steps.map(({ position, isCompleted, id }, index) => (
          <React.Fragment key={id}>
            {renderStep(position, isCompleted, index)}
          </React.Fragment>
        ))}

        <div className={styles.labelContainer}>
          {steps.map(({ label }, index) => (
            <div
              key={index}
              className={cn(
                styles.label,
                index === 1 ? 'text-center w-fit lg:ml-auto lg:mr-[70px]' : '',
                // eslint-disable-next-line no-nested-ternary
                index === 2
                  ? winningDirection !== ('None' as WinningDirection)
                    ? 'lg:mr-[65px]'
                    : 'lg:mr-[30px]'
                  : ''
              )}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineProgress;
