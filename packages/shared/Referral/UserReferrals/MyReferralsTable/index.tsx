import { useMemo } from 'react';
import { Table } from '@/components/Table';
import { cn } from '@/utils/cn';
import Avatar from '@/components/Avatar';
import { formatCurrency, formatUsdc } from '@/utils/formatCurrency';
import type { UserReferred } from '../..';

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return {
      date: `${month} ${day}, ${year}`,
      time: `${formattedHours}:${formattedMinutes} ${period}`,
    };
  } catch (error) {
    return {
      date: 'Invalid Date',
      time: 'Invalid Time',
    };
  }
};

type ReferredUser = {
  name: string;
  registeredAt: string;
  volume: number;
  orders: number;
  fees: number;
};

const MyReferralsTable = ({
  userReferredData,
}: {
  userReferredData: UserReferred | null;
}) => {
  const columns = useMemo(
    () => [
      {
        header: '#',
        accessor: (row: ReferredUser, index: number) => (
          <span>{switchMedail(index)}</span>
        ),
      },
      {
        header: 'User',
        accessor: (row: ReferredUser) => {
          return (
            <div className="flex items-center">
              <Avatar size={36} seed={row.name} />
              <div className="ml-2.5 flex flex-col">
                <span className="text-sm font-semibold text-white">
                  {row.name}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        header: 'Registered',
        accessor: (row: ReferredUser) => {
          const { date, time } = formatDate(row.registeredAt);
          return (
            <span className="flex flex-col font-medium text-[#C0C0C0]">
              <span className="text-sm">{date}</span>
              <span className="text-[13px]">{time}</span>
            </span>
          );
        },
      },
      {
        header: 'Referral Status',
        accessor: () => (
          <span>
            <span className="rounded-[4px] bg-[#4CAF50]/[0.08] px-2 py-1 font-semibold text-[#4CAF50]">
              Activated
            </span>
          </span>
        ),
      },
      {
        header: 'Opened Positions',
        accessor: (row: ReferredUser) => (
          <span className="text-white">{row.orders} Positions</span>
        ),
      },
      {
        header: 'Trade Volume',
        accessor: (row: ReferredUser) => (
          <div className="flex min-w-20 items-start">
            <span className="flex flex-col items-end">
              <span className="text-white">{formatUsdc(row.volume)}</span>
              <span className="text-xs text-white">
                {' '}
                ${Number(row.volume).toFixed(2)}
              </span>
            </span>
          </div>
        ),
      },
      {
        header: 'Fees Earned',
        accessor: (row: ReferredUser) => {
          const feesEarned = row.fees;
          return (
            <div className="flex items-end justify-center">
              <span className="text-[#4CAF50]">
                {formatCurrency(feesEarned)}
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const switchMedail = (idx: number) => {
    switch (idx) {
      case 0:
        return <span className="text-[#F2BE47]">🥇 #{idx + 1}</span>;

      case 1:
        return <span className="text-white">🥈 #{idx + 1}</span>;

      case 2:
        return <span className="text-[#CD7F32]">🥉 #{idx + 1}</span>;

      default:
        return <span className="text-[#C0C0C0]">#{idx + 1}</span>;
    }
  };

  if (!userReferredData?.users || userReferredData.users.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-[#C0C0C0]">No referrals found</span>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full overflow-x-auto lg:overflow-visible">
        <Table
          odd
          data={userReferredData.users}
          columns={columns}
          className={{
            tbody: 'space-y-3 border-none',
            th: 'whitespace-nowrap border-t-0 !text-[#C0C0C0] lg:px-5',
            td: 'whitespace-nowrap lg:px-5 last-of-type:lg:pl-0',
            thead: 'border-t-0',
            tr: (row, index) =>
              cn(
                index % 2 === 0 ? 'dark:bg-white/[2%]' : 'dark:bg-black/[2%]',
                'hover:bg-transparent cursor-default dark:lg:odd:hover:bg-transparent dark:lg:even:hover:bg-transparent max-h-10'
              ),
          }}
        />
      </div>
      {/* <Pagination
        currentPage={1}
        totalPages={1}
        setCurrentPage={() => {}}
        className="ml-auto mt-4 w-fit"
      /> */}
    </div>
  );
};

export default MyReferralsTable;
