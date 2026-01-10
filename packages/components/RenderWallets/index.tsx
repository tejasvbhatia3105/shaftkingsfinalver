import { cn } from '@/utils/cn';
import { formatNumberToShortScale } from '@/utils/formatCurrency';
import { isValidPublicKey } from '@/utils/publicKey';
import { truncateText } from '@/utils/truncateWallet';
import Image from 'next/image';
import Avatar from '../Avatar';

const RenderWallets = ({
  walletsList,
  type,
}: {
  walletsList: {
    name: string;
    shares: number;
    authority: string;
    poseidonLinked: string;
    image: string;
  }[];
  type: 'hype' | 'flop';
}) => {
  const textClass =
    type === 'hype' ? 'text-shaftkings-green-200' : 'text-shaftkings-red-300';

  if (walletsList.length === 0) {
    return (
      <div className="my-auto flex h-full items-center justify-center font-medium text-[#C0C0C0]">
        No history yet
      </div>
    );
  }

  return (
    <ul className="mt-3 flex flex-col divide-y divide-black/10 text-sm dark:divide-white/5">
      {walletsList.map((wallet) => (
        <li
          key={wallet.authority}
          className={cn(
            'flex items-center justify-between py-2.5 text-black dark:text-white',
            textClass
          )}
        >
          <div className="flex cursor-pointer items-center gap-x-1.5 max-[768px]:pointer-events-none lg:gap-x-3">
            <button
              className={cn(
                'flex size-6 lg:size-[34px] items-center justify-center rounded-[1px] bg-black/10 dark:bg-white/10'
              )}
            >
              <>
                <div className="hidden lg:block">
                  {wallet?.image?.trim() ? (
                    <Image
                      src={wallet.image}
                      alt="avatar"
                      width={30}
                      height={30}
                      unoptimized
                    />
                  ) : (
                    <Avatar size={30} seed={wallet.authority} hasList={true} />
                  )}
                </div>
                <div className="lg:hidden">
                  {wallet?.image?.trim() ? (
                    <Image
                      src={wallet.image}
                      alt="avatar"
                      width={14}
                      height={14}
                    />
                  ) : (
                    <Avatar size={14} seed={wallet.authority} hasList={true} />
                  )}
                </div>
              </>
            </button>
            <p className="max-w-[160px] truncate text-xs text-black dark:text-white lg:text-base">
              {isValidPublicKey(wallet.name)
                ? truncateText(wallet.name, 8)
                : wallet.name}
            </p>
          </div>
          <span className={cn('text-xs font-semibold lg:text-sm', textClass)}>
            {formatNumberToShortScale(
              parseFloat(Number(wallet.shares).toFixed(2)),
              0,
              false
            )}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default RenderWallets;
