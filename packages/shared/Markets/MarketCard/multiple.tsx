import { Button } from '@/components/Button';
import type { Market, MainMarket } from '@/types/market';
import { cn } from '@/utils/cn';
import { convertToPercentage } from '@/utils/convertToPercentage';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface MultipleCardViewProps {
  aggregates: Market[] | undefined;
  marketResponse: MainMarket;
}

const MultipleCardView: React.FC<MultipleCardViewProps> = ({ aggregates }) => {
  const [hoveredRow, setHoveredRow] = useState<number>(-1);
  const [hoveredButton, setHoveredButton] = useState<{
    marketIndex: number;
    type: 'Yes' | 'No' | null;
  }>({ marketIndex: -1, type: null });

  return (
    <div className="flex size-full flex-col items-center justify-center gap-y-1">
      {aggregates
        ?.sort((a, b) => b.hypePrice - a.hypePrice)
        ?.map((market, marketIndex) => {
          const percentage = Number(market.hypePrice * 100);
          const flopPercentage = 100 - percentage;
          const isHovered = hoveredRow === marketIndex;

          return (
            <div
              key={market.id}
              className="relative h-8 w-full cursor-pointer rounded-[1px] transition-all duration-300 ease-in-out"
              onMouseEnter={() => setHoveredRow(marketIndex)}
              onMouseLeave={() => setHoveredRow(-1)}
            >
              <div className="absolute left-0 top-0 z-0 size-full overflow-hidden rounded-[1px]">
                <motion.div
                  className={cn(
                    'absolute left-0 top-0 h-full bg-black/5 dark:bg-white/5 transition-opacity duration-300',
                    percentage >= 99 ? 'rounded-r-md' : 'rounded-r-md',
                    isHovered ? 'opacity-0' : 'opacity-100'
                  )}
                  initial={{ width: 0 }}
                  // animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>

              <div className="relative z-10 flex size-full items-center justify-between pl-3">
                <div className="flex items-center gap-1.5">
                  {market.image && (
                    <div className="flex max-h-5 min-h-5 min-w-5 max-w-5 items-center justify-center overflow-hidden rounded-full">
                      <img
                        src={market.image}
                        alt={market.question}
                        className="size-full object-cover"
                      />
                    </div>
                  )}

                  <h3 className="max-w-[100px] truncate whitespace-nowrap text-[13px] font-medium text-shaftkings-dark-100 dark:text-white ">
                    {market.question}
                  </h3>
                </div>

                <div className="flex items-center gap-x-2">
                  {/* {!isHovered && (
                    <div className="whitespace-nowrap text-base font-medium text-shaftkings-dark-100 dark:text-white">
                      {convertToPercentage(percentage)}
                    </div>
                  )} */}

                  {/* {isHovered && ( */}
                  <div className="flex items-center">
                    <span className="mr-2 text-sm font-bold text-white">
                      {percentage.toFixed(2)}%
                    </span>
                    <div className="flex items-center gap-x-1.5">
                      {[
                        {
                          label: 'Yes',
                          color: 'green',
                          price: convertToPercentage(percentage),
                        },
                        {
                          label: 'No',
                          color: 'red',
                          price: convertToPercentage(flopPercentage),
                        },
                      ].map((btn, btnIndex) => (
                        <Button
                          key={`${market.id}-${btn.label}-${btnIndex}`}
                          className={cn(
                            `rounded-[1px] h-7 transition-all duration-300 ease-in-out w-full font-semibold text-xs min-w-[52px]
                          bg-shaftkings-${btn.color}-200/10 text-shaftkings-${btn.color}-200
                          hover:bg-shaftkings-${btn.color}-200 hover:text-white`,
                            btn.label === 'No' && 'bg-shaftkings-red-300/10'
                          )}
                          onMouseEnter={() =>
                            setHoveredButton({
                              marketIndex,
                              type: btn.label as 'Yes' | 'No',
                            })
                          }
                          onMouseLeave={() =>
                            setHoveredButton({ marketIndex: -1, type: null })
                          }
                        >
                          {hoveredButton.marketIndex === marketIndex &&
                          hoveredButton.type === btn.label ? (
                            btn.price
                          ) : (
                            <span>{btn.label}</span>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* )} */}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default MultipleCardView;
