import { IconArrowDown, IconAttachment } from '@/components/Icons';
import { useMarket } from '@/context/Market';
import { useTheme } from 'next-themes';
import Link from 'next/link';

const OutcomeSource: React.FC = () => {
  const { selectedMarket } = useMarket();
  const { theme } = useTheme();

  return (
    <div className="my-8 flex h-auto w-full flex-col lg:mb-0">
      <span className="mb-2 text-[13px] text-[#606E85] dark:text-[#C0C0C0]">
        Track data to gain insights and strengthen your predictions.
      </span>

      <Link
        target="_blank"
        href="https://www.cricket.cricket/"
        className="mt-1.5 flex w-full items-center justify-between border-y border-black/10 px-0.5 py-2 dark:border-white/5 dark:hover:bg-white/[4%]"
      >
        <div className="flex items-center gap-x-2.5">
          <button className="flex size-10 items-center justify-center rounded bg-black/5 dark:bg-white/5">
            <IconAttachment />
          </button>

          <div className="flex flex-col font-medium">
            <span className="text-xs dark:text-[#C0C0C0]">Check Process</span>
            <span className="cursor-pointer text-sm text-shaftkings-gold-200">
              https://www.cricket.cricket/
            </span>
          </div>
        </div>

        <IconArrowDown
          circle={false}
          className="size-7"
          color={theme === 'dark' ? '#fff' : '#000'}
        />
      </Link>
    </div>
  );
};

export default OutcomeSource;
