import {
  IconOutcomeNo,
  IconOutcomeYes,
  IconTimeLarge,
  MinusCircleIcon,
  TriadSymbolIcon,
} from '@/components/Icons';
import OutcomeDropdown from '@/components/OutcomeDropdown';
import { useMarket } from '@/context/Market';
import type { MainMarket, Market } from '@/types/market';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';

const OutcomeResult = ({
  aggregates = [],
  mainMarket,
}: {
  aggregates: Market[];
  mainMarket: MainMarket;
}) => {
  const { selectedMarket } = useMarket();
  const [current, setCurrent] = useState<Market | null>(null);
  const [topOffset, setTopOffset] = useState(0);
  const stickyRef = useRef(null);

  const type = useMemo(() => {
    return selectedMarket?.winningDirection.toLowerCase();
  }, [selectedMarket]);

  const marketEnd = useMemo(() => {
    if (!selectedMarket?.marketEnd) return '';

    return mainMarket?.markets[0]?.marketEnd
      ? format(
          new Date(Number(selectedMarket.marketEnd) * 1000),
          'dd MMM, yyyy HH:mm'
        )
      : '';
  }, [mainMarket, selectedMarket?.marketEnd]);

  const isPending = useMemo(() => {
    return (
      type === 'none' &&
      new Date().getTime() / 1000 > Number(selectedMarket?.marketEnd)
    );
  }, [selectedMarket, type]);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('main-header');
      if (header) {
        const { height } = header.getBoundingClientRect();
        setTopOffset(height);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getOutcomeStyles = useCallback(() => {
    if (isPending) {
      return {
        bgColor: 'bg-yellow-500/10',
        borderColor: '',
        textColor: 'text-[#F2BE47]',
        text: 'Result Pending',
        icon: <IconTimeLarge />,
      };
    }

    switch (type) {
      case 'hype':
        return {
          bgColor: 'bg-emerald-500/10',
          borderColor: '',
          textColor: 'text-emerald-500',
          icon: <IconOutcomeYes />,
          text: selectedMarket?.yesSideName || 'Yes',
        };
      case 'flop':
        return {
          bgColor: 'bg-red-500/10',
          borderColor: '',
          textColor: 'text-shaftkings-red-300',
          icon: <IconOutcomeNo />,
          text: selectedMarket?.noSideName || 'No',
        };
      case 'draw':
        return {
          bgColor: 'bg-gray-500/10',
          borderColor: '',
          textColor: 'text-gray-500',
          text: 'Draw',
          icon: <MinusCircleIcon className="size-16" />,
        };
      default:
        return {
          bgColor: 'bg-yellow-500/10',
          borderColor: '',
          textColor: 'text-[#F2BE47]',
          text: 'Result Pending',
          icon: <IconTimeLarge />,
        };
    }
  }, [
    isPending,
    selectedMarket?.noSideName,
    selectedMarket?.yesSideName,
    type,
  ]);

  const cardElipse = useMemo(() => {
    if (type === 'hype') return '/assets/svg/green-elipse.svg';
    if (type === 'flop') return '/assets/svg/red-elipse.svg';
    if (type === 'draw') return '/assets/svg/gray-elipse.svg';
    return '/assets/svg/pending-resolve.svg';
  }, [type]);

  const triadIconColor = useMemo(() => {
    if (type === 'hype') return '#00B471';
    if (type === 'flop') return '#EE5F67';
    if (type === 'draw') return '#A1A7BB';
    return '#F2BE47';
  }, [type]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const styles = useMemo(() => getOutcomeStyles(), [type]);

  return (
    <div
      ref={stickyRef}
      style={{ top: topOffset + 40 }}
      className="sticky top-0 h-auto max-h-60 w-full max-w-[340px] overflow-hidden rounded-lg border border-white/10 bg-black/5"
    >
      <div className="relative">
        <Image
          className="absolute right-0"
          width={1330}
          height={1104}
          src={cardElipse}
          alt=""
        />
        <div className="relative p-4">
          <div className="mb-6 flex items-center justify-between gap-1">
            <div className="w-11/12">
              {aggregates.length > 0 && (
                <>
                  {current?.id && aggregates.length > 1 ? (
                    <OutcomeDropdown
                      options={aggregates.map((item) => ({
                        id: item.id.toString(),
                        image: item.image,
                        name: item.question,
                      }))}
                      value={current?.id}
                      onChange={(val) => {
                        const findItem = aggregates.find(
                          (item) => item.id === val
                        );
                        if (findItem) {
                          setCurrent(findItem);
                        }
                      }}
                      placeholder=""
                    />
                  ) : null}
                </>
              )}
            </div>

            <TriadSymbolIcon color={triadIconColor} />
          </div>

          <div className="mb-14 flex flex-col items-center">
            <div
              className={`mb-3 flex size-20 items-center justify-center rounded-full ${styles.bgColor} ${styles.borderColor}`}
            >
              {styles.icon}
            </div>
            <div className="text-center">
              <div className={`text-xl font-bold ${styles.textColor}`}>
                {styles.text !== 'Result Pending' && 'Result:'} {styles.text}
              </div>
              <div className="text-sm font-normal text-gray-400">
                {marketEnd}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutcomeResult;
