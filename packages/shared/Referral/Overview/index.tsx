import { useMemo } from 'react';
import { IconUsers, IconYellowMoney } from '@/components/Icons';
import {
  formatCurrency,
  formatNumberToShortScale,
} from '@/utils/formatCurrency';
import type { UserReferred } from '..';

const Overview = ({
  userReferredData,
}: {
  userReferredData: UserReferred | null;
}) => {
  const overviewCards = useMemo(() => {
    return [
      {
        icon: <IconUsers />,
        title: 'Total Referrals',
        amount: formatNumberToShortScale(userReferredData?.total || 0, 0),
        growth: formatNumberToShortScale(100, 0),
      },
      {
        icon: <IconYellowMoney />,
        title: 'Total Referred Vol.',
        amount: formatNumberToShortScale(userReferredData?.volume || 0, 0),
        growth: formatNumberToShortScale(100, 0),
      },
    ];
  }, [userReferredData?.total, userReferredData?.volume]);

  return (
    <div className="mx-auto mt-[140px] flex max-w-[1200px] flex-col px-2.5 lg:px-0">
      <span className="text-2xl font-bold text-white">
        Your Account Overview
      </span>
      <span className="text-sm font-normal text-[#C0C0C0]">
        Get a complete overview of your referral program, track your earnings,
        and monitor your referrals performance all in one place.
      </span>
      <div className="mb-8 mt-4 flex flex-col lg:flex-row lg:items-center">
        <div className="w-4/12">
          <div className="flex size-[86px] items-center justify-center bg-gradient-to-tr from-[#F8E173] to-[#1A237E] p-[2px]">
            <div className="size-full border-[4px] border-black"></div>
          </div>
          <span className="mt-5 block text-sm font-semibold text-white">
            Total Reward (USD)
          </span>
          <span className="text-[40px] font-bold text-[#4CAF50]">
            {formatCurrency(userReferredData?.rewards || 0)}
          </span>
          {/* <span className="block text-xs font-semibold text-[#4CAF50]">
            +$50.91K
          </span> */}
        </div>
        <div className="w-full overflow-x-auto lg:w-8/12 lg:overflow-visible">
          <div className="flex w-max gap-x-3 lg:grid lg:w-full lg:grid-cols-3">
            {overviewCards.map((item, key) => (
              <div
                key={key}
                className="flex h-[160px] min-w-[240px] shrink-0 flex-col justify-end gap-y-1 bg-white/5 p-4"
              >
                <div className="flex size-[42px] items-center justify-center bg-[#F8E173]">
                  {item.icon}
                </div>
                <span className="mt-2 text-[13px] font-medium text-[#C0C0C0]">
                  {item.title}
                </span>
                <span className="flex items-center text-2xl font-bold text-white">
                  {item.amount}{' '}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
