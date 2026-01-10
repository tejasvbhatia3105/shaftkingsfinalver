import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';
import { IconClock } from '../Icons';

type CountdownTimerProps = {
  target: number;
  countdownEnd: () => void;
  className?: string;
};

const Countdown = ({
  target,
  countdownEnd,
  className,
}: CountdownTimerProps) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const endDate = target * 1000;
    const difference = endDate - now;

    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      if (timeLeft.seconds !== 0) {
        countdownEnd();
      }
      timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return timeLeft;
  };

  const formatNumber = (number: number) => {
    return number < 10 ? `0${number}` : `${number}`;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="flex items-center">
      <span
        className={cn(
          'min-w-[120px] flex-row items-center justify-center rounded  p-1.5 text-center  text-shaftkings-gold-200 dark:bg-transparent !text-[13px]',
          className
        )}
      >
        <IconClock color="#F8E173" />
        <span className="ml-1 mr-[2px]">{timeLeft.days}d</span>
        <span>{formatNumber(timeLeft.hours)}</span>h
        <span className="ml-1">{formatNumber(timeLeft.minutes)}</span>m
        <span className="ml-1">{formatNumber(timeLeft.seconds)}</span>s
      </span>
    </div>
  );
};

export default Countdown;
