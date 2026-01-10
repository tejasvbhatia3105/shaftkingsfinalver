'use client';

import {
  FillClose,
  IconAdviseSecondary,
  IconAlreadyCopy,
  IconCopy,
  IconGraph,
  IconMoney,
  IconPortfolioSecondary,
  IconVariantWallet,
  PencilIcon,
} from '@/components/Icons';
import Tooltip from '@/components/Tooltip';
import { useTriad } from '@/context/Triad';
import { useUser } from '@/context/User';
import type { Order } from '@/types/market';
import type { UserData } from '@/types/user';
import { cn } from '@/utils/cn';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { Geoform } from '@/utils/fonts';
import {
  formatCurrency,
  formatNumberToShortScale,
  formatUsdc,
} from '@/utils/formatCurrency';
import { truncateWallet } from '@/utils/truncateWallet';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';

type HeadProfileProps = {
  userData: UserData;
  userOrders: Order[];
};

const HeadProfile = ({ userData, userOrders }: HeadProfileProps) => {
  const { loadingUser, connectedUser } = useTriad();
  const { balanceUSDC, wallet } = useUser();
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const portfolioAmount = useMemo(() => {
    const totalValue = 0;

    const positionsOpen = userOrders
      .filter((item) => Number(item?.shares) > 0)
      .reduce((acc, current) => acc + current.amount, 0);
    return totalValue + positionsOpen;
  }, [userOrders]);

  const generalInfos = useMemo(
    () => [
      {
        title: (
          <div className="flex items-center gap-x-1">
            Portfolio Value
            <Tooltip
              direction="top"
              styleMessage="dark:bg-shaftkings-dark-250"
              tooltipMessage="This value is based on your open positions combined with the amount you have staked in TRD."
            >
              <IconAdviseSecondary />
            </Tooltip>
          </div>
        ),
        value: `${formatNumberToShortScale(
          parseFloat(portfolioAmount.toFixed(2)),
          0,
          true
        )}`,
        icon: <IconVariantWallet />,
        color: '#F8E173',
      },
      {
        title: 'Balance Value',
        value: (
          <div className="flex items-center gap-x-1">
            {formatUsdc(balanceUSDC)}
          </div>
        ),
        icon: <IconPortfolioSecondary />,
        color: '#1A237E',
      },
      {
        title: 'All Time PNL',
        value: (
          <div className="flex items-center gap-x-1">
            {formatCurrency(Number((userData?.pnl || 0).toFixed(2)))}
          </div>
        ),
        icon: <IconMoney />,
        color: '#020936',
      },
      {
        title: 'Total 30D Volume',
        value: (
          <div className="flex items-center gap-x-1">
            {formatCurrency(Number((userData?.volume || 0).toFixed(2)))}
          </div>
        ),
        icon: <IconGraph />,
        color: '#CDAC4D',
      },
    ],
    [balanceUSDC, portfolioAmount, userData?.pnl, userData?.volume]
  );

  const handleCopy = useCallback(() => {
    copyToClipboard(
      `${
        typeof window !== 'undefined'
          ? window.location.origin
          : 'https://www.shaftkings.com'
      }/?ref=${userData.name}`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [userData?.name]);

  return (
    <div className="relative z-10 mb-6">
      <div
        className={cn(
          'relative flex w-full flex-col text-shaftkings-dark-100 dark:text-white  lg:px-0',
          Geoform.className
        )}
      >
        <div className="bordeer-b mb-10 flex w-full justify-between border-white/10">
          <span className="text-2xl text-white lg:text-3xl">Profile</span>
          <Link className="lg:hidden" href="/">
            <FillClose />
          </Link>
        </div>

        <div className="flex w-full flex-row items-center justify-center gap-3 lg:mb-0 lg:justify-start lg:gap-x-5">
          <div className="flex flex-col items-center justify-center lg:flex-row">
            {connectedUser?.image.trim() ? (
              <Image
                className="w-[112px] object-cover"
                src={
                  userData.authority === connectedUser?.authority
                    ? connectedUser.image
                    : userData.image
                }
                alt="avatar"
                width={112}
                height={112}
                unoptimized
              />
            ) : (
              <div className="size-[112px]">
                <div className="size-full rounded-[1px] bg-gradient-to-r from-[#CEAC4D] to-[#F8E173] p-[2px]">
                  <div className="flex size-full items-center justify-center rounded-[1px] bg-white p-[2px] dark:bg-[#0F0F0F]">
                    <div className="flex size-[83px] min-w-[46px] items-center justify-center rounded-[1px] lg:min-w-[83px]">
                      <img
                        className="w-[92px]"
                        src="/assets/img/shaftkings-cricket.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-col items-center justify-center lg:mt-2 lg:items-start lg:pl-4">
              <span className="flex font-medium">
                {loadingUser ? (
                  <div className="animate-loading h-6 w-24 rounded dark:bg-shaftkings-dark-450" />
                ) : userData.authority === connectedUser?.authority ? (
                  truncateWallet(connectedUser?.name || '')
                ) : (
                  truncateWallet(userData?.name || '')
                )}
              </span>

              <button
                className={cn(
                  'flex items-center mt-2 justify-center w-full h-8 max-w-[160px] min-w-[160px] gap-1.5 whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium transition-all duration-300 ease-in-out lg:text-[13px]',
                  isCopied
                    ? 'bg-shaftkings-green-200 text-white '
                    : 'dark:bg-white/[0.08] bg-black/5 text-shaftkings-gray-600 dark:text-[#C0C0C0]'
                )}
                onClick={handleCopy}
              >
                {isCopied ? 'Copied!' : 'Copy my Referral link'}
                {isCopied ? (
                  <IconAlreadyCopy />
                ) : (
                  <IconCopy color="#C0C0C0" className="min-w-2.5" />
                )}
              </button>
            </div>
          </div>
          {wallet?.connected && (
            <button
              className={cn(
                'flex items-center mt-2 justify-center h-8 w-fit gap-1.5 whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium transition-all duration-300 ease-in-out lg:text-[13px] dark:bg-white/5 bg-black/5 text-shaftkings-gray-600 dark:text-[#C0C0C0] absolute right-2 top-12 lg:top-[110px]'
              )}
              onClick={() =>
                router.push(`/profile/${wallet?.publicKey?.toBase58()}/edit`)
              }
            >
              <PencilIcon />
              <span className="hidden lg:block">Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      <div className="my-5 h-[1px] w-full bg-black/5 dark:bg-white/5" />

      <div
        className={cn(
          'grid grid-cols-2 place-items-center gap-[6px] sm:grid-cols-4',
          Geoform.className
        )}
      >
        {generalInfos.map((info, idx) => (
          <div
            key={idx}
            className={cn(
              'flex border gap-y-1.5 border-shaftkings-gray-1000 dark:border-[#FFFFFF1A] justify-between rounded-[1px] p-3 w-full max-[648px]:items-center bg-shaftkings-gray-300/15 backdrop-blur-xl dark:backdrop-blur-0 dark:bg-[#FFFFFF0F] flex-col '
            )}
          >
            <div
              style={{ background: info.color }}
              className="flex size-[32px] items-center justify-center md:mb-9 lg:size-[42px]"
            >
              {info.icon}
            </div>
            <span className="whitespace-nowrap text-xs font-medium text-[#C0C0C0]">
              {info.title}
            </span>
            {loadingUser ? (
              <div className="animate-loading h-6 w-24 rounded dark:bg-shaftkings-dark-450" />
            ) : (
              <div className="text-sm font-semibold text-shaftkings-dark-100 dark:text-white lg:text-lg">
                {info.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeadProfile;
