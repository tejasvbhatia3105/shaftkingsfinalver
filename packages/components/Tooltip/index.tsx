import { cn } from '@/utils/cn';
import { Inter } from 'next/font/google';

interface Props {
  tooltipMessage: React.ReactNode | string;
  children: React.ReactNode;
  direction: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  HiddenRelative?: boolean;
  styleMessage?: string;
  secondarycolor?: string;
}

const inter = Inter({ subsets: ['latin'] });

const Tooltip: React.FC<Props> = ({
  children,
  tooltipMessage,
  direction,
  className,
  HiddenRelative = false,
  styleMessage,
  secondarycolor,
}) => {
  const message = tooltipMessage;

  const tooltipAdditionalStyle = {
    '--tooltip-background': secondarycolor || '#2e3038',
  };

  return (
    <div
      className={cn(
        'tooltip h-full  cursor-pointer flex justify-center w-fit',
        { relative: HiddenRelative === false },
        className
      )}
    >
      <div className="flex size-full">{children}</div>

      {message && (
        <div
          style={{ ...tooltipAdditionalStyle, border: '0.5px solid #FFFFFF12' }}
          className={cn(
            'tooltip-content pointer-events-none flex opacity-0 !text-sm items-center justify-center rounded-[4px] absolute z-[50] max-w-[260px]  lg:max-w-[300px] min-w-[260px] lg:min-w-max py-[7px] px-[14px] text-white bg-black/80 dark:bg-white/5 backdrop-blur-xl',
            direction,
            styleMessage
          )}
        >
          <span
            className={cn(
              'flex max-w-[300px] !whitespace-pre-wrap !text-xs !font-medium !tracking-normal',
              inter.className
            )}
          >
            {message}
          </span>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
