import { IconClose } from '@/components/Icons';
import TradeCard from '@/components/TradeCard';
import { useMarket } from '@/context/Market';
import {
  MarketType,
  type MainMarket,
  type Order,
  type OrderBook,
} from '@/types/market';
import { cn } from '@/utils/cn';
import { getTeamImage } from '@/utils/getTeamImage';
import { useCallback, useEffect, useState } from 'react';

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
    selectedMarket,
    openMobileDeposit,
    setOpenMobileDeposit,
    selectedOption,
  } = useMarket();

  const handleCloseModal = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setOpenMobileDeposit(false);
      setIsClosing(false);
    }, 300);
  }, [setOpenMobileDeposit]);

  useEffect(() => {
    const setBodyOverflow = (isHidden: boolean) => {
      const overflowValue = isHidden ? 'hidden' : '';
      document.body.style.overflow = overflowValue;
      document.documentElement.style.overflow = overflowValue;
    };

    setBodyOverflow(openMobileDeposit);

    return () => setBodyOverflow(false);
  }, [openMobileDeposit]);

  return (
    <div className="relative z-40">
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
            <div className="relative flex w-full items-center justify-between p-2 pt-5">
              <div className="flex w-full items-center gap-x-2">
                {getTeamImage(selectedOption)}
                <div className="max-w-[260px]">
                  <span className="text-sm text-shaftkings-dark-100 dark:text-white">
                    {selectedOption}
                  </span>
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
              mainMarket={mainMarket}
              market={selectedMarket!}
              type={mainMarket?.type || MarketType.SINGLE}
              marketIndex={marketIndex}
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
