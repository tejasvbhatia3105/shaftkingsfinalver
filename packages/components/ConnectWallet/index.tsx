'use client';

import { Button } from '@/components/Button';
import { useSolana } from '@/context/Solana';
import { useTriad } from '@/context/Triad';
import { useUser } from '@/context/User';
import { cn } from '@/utils/cn';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { truncateWallet } from '@/utils/truncateWallet';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Avatar from '../Avatar';
import { IconCopy, IconLoading, IconWallet } from '../Icons';

type ConnectWalletProps = {
  className?: string;
  points?: number;
};

const ConnectWallet = ({ className }: ConnectWalletProps) => {
  const { wallet, loadingStorageUser, loadingLogin, signOut } = useUser();
  const filterRef = useRef<HTMLDivElement>(null);
  const { setOpenConnect } = useSolana();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { connectedUser } = useTriad();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setIsMobile(windowWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const handleClickConnect = useCallback(() => {
    if (wallet?.publicKey) {
      setOpenDropdown((prevState) => !prevState);
      setOpenConnect(false);
      return;
    }

    setOpenConnect(true);
  }, [wallet?.publicKey, setOpenConnect]);

  const disconnectWallet = useCallback(() => {
    signOut();
    setOpenDropdown(false);
  }, [signOut]);

  useEffect(() => {
    if (wallet?.publicKey) {
      setIsInitializing(false);
      setOpenConnect(false);
    } else if (!isInitializing) {
      setOpenConnect(true);
    }
  }, [wallet?.publicKey, isInitializing, setOpenConnect]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [filterRef]);

  const renderWallet = useMemo(() => {
    if (wallet?.publicKey) {
      return (
        <>
          <div className="flex size-6 items-center justify-center rounded-full">
            {connectedUser?.image.trim() ? (
              <Image
                className="size-[24px] object-cover"
                src={connectedUser.image}
                alt="avatar"
                width={24}
                height={24}
                unoptimized
              />
            ) : (
              <Avatar size={24} seed={wallet?.publicKey.toBase58()} />
            )}
          </div>
        </>
      );
    }

    return (
      <span className="min-w-[80px] whitespace-nowrap text-xs lg:min-w-[107px]">
        SIGN IN
      </span>
    );
  }, [connectedUser?.image, wallet?.publicKey]);

  if (loadingStorageUser || loadingLogin)
    return (
      <div className="flex w-12 items-center justify-center gap-3 text-xs text-shaftkings-dark-100 dark:text-white lg:w-48 lg:text-sm">
        <span className="hidden whitespace-nowrap font-medium lg:inline-flex">
          Fetching user info...
        </span>
        <IconLoading />
      </div>
    );

  return (
    <div ref={filterRef} className={cn('relative', className)}>
      <div className="flex items-center gap-x-3">
        <Button
          className={cn(
            ' w-fit justify-center rounded-[1px] border-0 font-medium text-black uppercase text-xs',
            {
              'bg-gray-200 dark:bg-white/[2%] border border-white/10 p-0 h-[24px]':
                wallet?.publicKey,
              'h-[30px] lg:h-[44px] px-1': !wallet?.publicKey,
            }
          )}
          color={wallet?.publicKey ? 'secondary' : 'gold'}
          size="default"
          onClick={handleClickConnect}
        >
          {renderWallet}
        </Button>
      </div>

      {openDropdown && (
        <div
          style={{ boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)' }}
          className={cn(
            'grid grid-rows-1 z-[100] border border-black/20 dark:border-shaftkings-dark-200 grid-row-gap-5 bg-gray-200 dark:bg-black shadow-lg pt-6 pb-5 px-0 absolute w-[220px] lg:w-[260px] right-0 top-full mt-2 lg:mt-2 transition-opacity animate-fade-down animate-duration-300 animate-ease-out rounded-[1px]'
          )}
        >
          <div className="mb-2 flex gap-x-3 border-b border-white/5 px-4 pb-4">
            {wallet?.publicKey && (
              <div className="flex size-[42px] items-center justify-center overflow-hidden rounded">
                {connectedUser?.image.trim() ? (
                  <Image
                    className="size-[42px] object-cover"
                    src={connectedUser.image}
                    alt="avatar"
                    width={42}
                    height={42}
                    unoptimized
                  />
                ) : (
                  <Avatar size={42} seed={wallet?.publicKey.toBase58()} />
                )}
              </div>
            )}
            <div>
              <span className="mr-2 flex max-w-[80px] !cursor-pointer truncate text-xs font-medium text-shaftkings-dark-100 dark:text-white">
                {connectedUser?.name || 'Wallet Address'}
              </span>
              <button
                aria-label="copy button"
                onClick={() => copyToClipboard(wallet?.publicKey?.toBase58())}
                className="mt-0.5 flex w-fit items-center rounded bg-white/5 px-4 py-1"
              >
                <span className="mr-2 flex !cursor-pointer pt-0.5 text-xs font-medium text-shaftkings-dark-100 dark:text-white">
                  {truncateWallet(wallet?.publicKey?.toBase58())}
                </span>
                <IconCopy />
              </button>
            </div>
          </div>

          <div className="flex w-full px-4">
            <Link
              onClick={() => setOpenDropdown(false)}
              href={`/profile/${wallet?.publicKey?.toBase58()}`}
              className="mt-0.5 flex w-fit items-center rounded bg-white/5 px-4 py-1"
            >
              <span className="mr-2 flex !cursor-pointer pt-0.5 text-xs font-medium text-shaftkings-dark-100 dark:text-white">
                Profile
              </span>
              <IconWallet />
            </Link>
          </div>

          <button
            onClick={disconnectWallet}
            className="my-2 mt-8 cursor-pointer text-center text-sm font-medium text-shaftkings-red-200"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
