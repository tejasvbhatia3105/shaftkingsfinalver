import { IconClose } from '@/components/Icons';
import RenderOutcome from '@/components/Outcome';
import TradeCard from '@/components/TradeCard';
import { useMarket } from '@/context/Market';
import type { MainMarket, Order, OrderBook } from '@/types/market';
import { MarketType, WinningDirection } from '@/types/market';
import { cn } from '@/utils/cn';
import { PoppinsFont } from '@/utils/fonts';
import { formatCents } from '@/utils/formatCents';
import { marketEnded } from '@/utils/helpers';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';

const MarketDepositMobile = ({
  mainMarket,
  marketIndex,
  orders,
  orderBook,
}: {
  mainMarket: MainMarket;
  marketIndex: number;
  orders: Order[];
  orderBook: OrderBook;
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const {
    setSelectedOption,
    selectedOption,
    selectedMarket,
    openMobileDeposit,
    setOpenMobileDeposit,
  } = useMarket();

  const isMarketEnd = useMemo(
    () => marketEnded(selectedMarket!),
    [selectedMarket]
  );

  const handleOpenDepositCard = useCallback(
    (type: string) => {
      setSelectedOption(type);

      if (openMobileDeposit) {
        setIsClosing(true);
        setTimeout(() => {
          setOpenMobileDeposit(false);
          setIsClosing(false);
        }, 300);
      } else {
        setOpenMobileDeposit(true);
      }
    },
    [openMobileDeposit, setOpenMobileDeposit, setSelectedOption]
  );

  const handleCloseModal = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setOpenMobileDeposit(false);
      setIsClosing(false);
    }, 300);
  }, [setOpenMobileDeposit]);

  return (
    <div className="relative z-40">
      <div
        className={cn(
          'fixed bottom-[0px] z-50 left-0 flex w-full items-center justify-between gap-x-2.5 bg-white/5 p-2 shadow-md backdrop-blur-md',
          PoppinsFont.className
        )}
      >
        {isMarketEnd &&
        selectedMarket?.winningDirection !== WinningDirection.NONE ? (
          <RenderOutcome
            market={selectedMarket!}
            agregattes={mainMarket?.markets || []}
          />
        ) : (
          <>
            <button
              onClick={() => handleOpenDepositCard('Yes')}
              className={cn(
                'flex flex-1 z-30 gap-x-1 items-center h-9 text-white font-normal justify-center rounded-[1px] bg-shaftkings-green-200'
              )}
            >
              <span>Yes</span>{' '}
              <span className="relative top-0">
                {formatCents(selectedMarket?.hypePrice || 0)}
              </span>
            </button>
            <button
              onClick={() => handleOpenDepositCard('No')}
              className={cn(
                'flex flex-1 gap-x-1 items-center h-9 text-white font-normal justify-center rounded-[1px] bg-shaftkings-red-300'
              )}
            >
              <span>No</span>{' '}
              <span className="relative top-0">
                {formatCents(selectedMarket?.flopPrice || 0)}
              </span>
            </button>
          </>
        )}
      </div>

      {openMobileDeposit && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center bg-white dark:bg-black/30"
          onClick={handleCloseModal}
        >
          <div
            className={cn(
              'w-full h-full mt-12 text-white dark:bg-shaftkings-dark-400 border border-shaftkings-dark-200 transform',
              isClosing ? 'modal-slide-down' : 'modal-slide-up'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex w-full items-center justify-between p-2">
              <div className="flex w-full gap-x-2">
                <div className="relative size-10">
                  <Image
                    width={40}
                    height={40}
                    className="size-10 rounded-[1px] object-cover"
                    src={selectedMarket?.image || ''}
                    alt={selectedMarket?.question || ''}
                  />
                </div>
                <div className="max-w-[250px] truncate">
                  <span className="text-sm text-shaftkings-dark-100 dark:text-white">
                    {selectedMarket?.question}
                  </span>

                  <div className="flex items-center gap-x-1 text-xs text-shaftkings-gray-400 dark:text-[#C0C0C0]">
                    Buying{' '}
                    {selectedOption === 'Yes' ? (
                      <span className="font-semibold text-shaftkings-green-200">
                        Yes Shares
                      </span>
                    ) : (
                      <span className="font-semibold text-shaftkings-red-300">
                        No Shares
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="absolute right-2 flex size-9 items-center justify-center rounded-full bg-white/10 p-1"
              >
                <IconClose />
              </button>
            </div>
            <TradeCard
              market={selectedMarket!}
              type={mainMarket?.type || MarketType.SINGLE}
              marketIndex={marketIndex}
              mainMarket={mainMarket}
              orders={orders}
              orderBook={orderBook}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketDepositMobile;
