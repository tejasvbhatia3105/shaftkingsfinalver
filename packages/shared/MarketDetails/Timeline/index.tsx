import { IconAdviseSecondary } from '@/components/Icons';
import Tooltip from '@/components/Tooltip';
import { useGlobal } from '@/context/Global';
import { useMarket } from '@/context/Market';
import { cn } from '@/utils/cn';
import { truncateText } from '@/utils/truncateWallet';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MainMarket } from '@/types/market';
import { WinningDirection } from '@/types/market';
import TimelineProgress from './Progress';

type TimelineProps = {
  mainMarket: MainMarket;
};

const Timeline = ({ mainMarket }: TimelineProps) => {
  const { setRulesModalOpen } = useGlobal();
  const [isExpanded] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState(false);
  const { selectedMarket } = useMarket();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAction = useCallback(() => {
    window.open('https://discord.com/invite/37rMg4YzWN', '_blank');
  }, [setRulesModalOpen]);

  const timelineParagraphs = useMemo(() => {
    if (!selectedMarket || !mainMarket) return [];

    const questionText = mainMarket.question.replace(/-/g, ' ');
    const resolutionDate = format(
      new Date(Number(selectedMarket.marketEnd) * 1000),
      "MMM dd 'at' HH:mm"
    );

    return [
      selectedMarket?.description ||
        `This market will be resolved based on the outcome of the question: '${questionText}', which will be closed on ${resolutionDate}. The resolution will take place on the following day, according to the criteria outlined in the market rules and the provided question context.`,
      'Payment will be executed within 24 hours after the conclusion of the Prediction Market.',
    ];
  }, [mainMarket, selectedMarket]);

  if (!selectedMarket) {
    return (
      <div className="my-10 text-center text-gray-400">
        Market data is unavailable at the moment.
      </div>
    );
  }

  return (
    <>
      <div className="relative flex h-auto w-full flex-col border-y border-[#E5E5E5] py-6 text-sm font-medium text-shaftkings-gray-400 dark:border-white/5 dark:text-[#C0C0C0] lg:gap-y-3">
        <div className="flex items-center gap-x-1">
          <h4 className="mb-3 text-lg font-semibold text-shaftkings-dark-100 dark:text-white lg:mb-0">
            Timeline and Payment
          </h4>

          <Tooltip
            direction="bottom"
            tooltipMessage="The timeline shows the key stages of the market, from opening to closing, including deadlines for placing predictions and resolutions. The payout indicates when rewards will be distributed, which occurs within 24 hours after the market closes."
          >
            <IconAdviseSecondary className="mt-1.5" />
          </Tooltip>
        </div>

        <TimelineProgress market={selectedMarket} />

        <motion.div
          className={cn(
            'relative flex flex-col overflow-hidden w-full',
            isExpanded ? 'lg:mb-4' : 'mb-8 lg:h-[75px]'
          )}
          initial={false}
          animate={{
            // eslint-disable-next-line no-nested-ternary
            height: isExpanded ? 'auto' : isMobile ? '80px' : '75px',
            transition: { duration: 0.3, ease: 'easeInOut' },
          }}
        >
          <h3 className="text-triad-dark-100 mb-1 text-lg font-semibold dark:text-white">
            Rules & Outcome Source
          </h3>

          {selectedMarket.winningDirection !== WinningDirection.NONE && (
            <span className="text-triad-dark-150 text-[13px]">
              This market has already been resolved as{' '}
              <strong className="text-black dark:text-white">
                {selectedMarket.winningDirection === WinningDirection.HYPE
                  ? selectedMarket.yesSideName || 'Yes'
                  : selectedMarket.noSideName || 'No'}
              </strong>{' '}
              on{' '}
              <strong className="text-black dark:text-white">
                {format(
                  new Date(Number(selectedMarket.marketEnd) * 1000),
                  "MMM dd 'at' HH:mm"
                )}
              </strong>
              .
            </span>
          )}

          <p
            dangerouslySetInnerHTML={{
              __html: (!isExpanded && isMobile
                ? truncateText(timelineParagraphs[0], 60)
                : timelineParagraphs[0]
              )
                .replace(/\\n/g, '<br />')
                .replace(/\n/g, '<br />'),
            }}
            className="mt-4 text-[13px] font-normal"
          />

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex flex-col gap-4"
              >
                <p className="dark:text-triad-dark-150 mt-6 text-[13px] font-normal text-[#606E85]">
                  {timelineParagraphs[1]}
                </p>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setRulesModalOpen(true)}
                    className="dark:text-triad-dark-150 flex items-center justify-center rounded border border-transparent bg-black/5 px-3 py-2.5 text-xs font-medium transition-all duration-100 hover:border-black/10 disabled:cursor-not-allowed dark:bg-white/5 dark:hover:border-white/10"
                  >
                    View Market Rules
                  </button>
                  <button
                    onClick={() => handleAction()}
                    className="dark:text-triad-dark-150 flex items-center justify-center rounded border border-transparent bg-black/5 px-3 py-2.5 text-xs font-medium transition-all duration-100 hover:border-black/10 disabled:cursor-not-allowed dark:bg-white/5 dark:hover:border-white/10"
                  >
                    Help & Support
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isExpanded && (
            <div className="dark:from-triad-dark-400 absolute bottom-0 h-5 w-full bg-gradient-to-t to-transparent lg:hidden" />
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Timeline;
