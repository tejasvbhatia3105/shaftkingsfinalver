'use client';

import { useCallback, useMemo } from 'react';
import { Table } from '@/components/Table';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import type { ClaimVault } from '@/types/claim';
import { useTriad } from '@/context/Triad';
import { Button } from '@/components/Button';
import { useUser } from '@/context/User';

const ClaimVaultsTable = ({
  claimVaults,
  onRefresh,
}: {
  claimVaults: ClaimVault[];
  onRefresh: () => void;
}) => {
  const { wallet } = useUser();
  const { claimUserVault } = useTriad();

  const handleClaim = useCallback(
    async (row: ClaimVault) => {
      await claimUserVault(row);
      onRefresh();
    },
    [claimUserVault, onRefresh]
  );

  const columns = useMemo(
    () => [
      {
        header: 'Next Claim Date',
        accessor: (row: ClaimVault) => {
          const date = new Date(Number(row.initTs) * 1000);
          return (
            <span className="flex flex-col font-medium text-[#C0C0C0]">
              <span className="text-sm">{row.name}</span>
              <span className="text-[13px]">{date.toLocaleDateString()}</span>
            </span>
          );
        },
      },

      {
        header: 'Amount',
        accessor: (row: ClaimVault) => {
          const claimData = row.claimData.find(
            (item) => item.authority === wallet?.publicKey.toString()
          );

          return (
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-white">
                {claimData?.amount} USDC
              </span>
              <span className="text-xs text-white">
                {formatCurrency(Number(claimData?.amount))}
              </span>
            </div>
          );
        },
      },
      {
        header: 'Rewards Status',
        accessor: (row: ClaimVault) => {
          const isClaimed = row.claimedUser.find(
            (item) => item.authority === wallet?.publicKey.toString()
          );
          return (
            <span className="flex justify-end">
              <span
                className={cn(
                  'rounded-[4px] px-2 py-1 font-semibold',
                  !isClaimed
                    ? 'bg-[#4CAF50]/[0.08] text-[#4CAF50]'
                    : 'bg-[#6772E0]/[0.10] text-[#6772E0]'
                )}
              >
                {isClaimed ? 'Claimed' : 'Claim'}
              </span>
            </span>
          );
        },
      },
      {
        header: 'Action',
        accessor: (row: ClaimVault) => {
          const isClaimed = row.claimedUser.find(
            (item) => item.authority === wallet?.publicKey.toString()
          );

          return (
            <div className="flex justify-end">
              <Button
                color="gold"
                onClick={() => handleClaim(row)}
                disabled={!!isClaimed}
                className={cn('min-h-[36px] min-w-[96px] rounded-none', {
                  '!bg-black/[0.08] !text-[#C0C0C0]/[0.50]': isClaimed,
                })}
              >
                Claim
              </Button>
            </div>
          );
        },
      },
    ],
    [wallet?.publicKey, handleClaim]
  );

  if (!claimVaults || claimVaults.length === 0) {
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
          data={claimVaults}
          columns={columns}
          className={{
            tbody: 'space-y-3 border-none',
            th: 'whitespace-nowrap border-t-0 text-right !text-[#C0C0C0] first:text-left lg:px-5',
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

export default ClaimVaultsTable;
