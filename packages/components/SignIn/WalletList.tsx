'use client';

import { useSolana } from '@/context/Solana';
import { useUser } from '@/context/User';
import type { LoginProvider } from '@/types/magic';
import { magicAuthProviders } from '@/utils/authProviders';
import type { WalletName } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { BaseCard } from './BaseCard';
import { ListLoad } from './ListLoad';

type WalletListProps = {
  closeModal: () => void;
};

const WalletList: React.FC<WalletListProps> = ({ closeModal }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { wallets, select } = useWallet();
  const { handleLogin } = useUser();
  const { setOpenConnect } = useSolana();
  const [loading, setLoading] = useState(true);
  const [showOption, setShowOption] = useState(false);

  useEffect(() => {
    if (wallets.length > 0) {
      setLoading(false);
    }
  }, [wallets.length]);

  const handleConnectPhantom = useCallback(
    (walletName: string) => {
      select(walletName as WalletName | null);

      closeModal();
      setOpenConnect(false);
    },
    [closeModal, select, setOpenConnect]
  );

  const handleMagicLogin = useCallback(
    async (provider: LoginProvider) => {
      try {
        await handleLogin(provider);

        closeModal();
        setOpenConnect(false);
      } catch (error) {
        /* empty */
      }
    },
    [closeModal, handleLogin, setOpenConnect]
  );

  const MagicCard = useCallback(
    ({
      provider,
      name,
      icon,
    }: {
      provider: LoginProvider;
      name: string;
      icon: string;
    }) => {
      return (
        <div
          onClick={() => handleMagicLogin(provider)}
          className="mb-2.5 flex cursor-pointer flex-row items-center justify-center rounded-lg border border-black/10 bg-white/10 p-3 text-xs font-medium transition-all hover:bg-black/5 dark:border-transparent dark:bg-white/5  dark:text-white dark:hover:bg-white/10 lg:text-sm"
        >
          <Image
            src={icon}
            alt={`${name} logo`}
            width={21}
            height={16}
            // className="h-[16px] w-[21px]"
          />
          <span className="ml-2 text-sm font-semibold text-black dark:text-white">
            Continue with {name}
          </span>
        </div>
      );
    },
    [handleMagicLogin]
  );

  const phantomWallet = wallets.find(
    (wallet) => wallet.adapter.name.toLowerCase() === 'phantom'
  );

  const otherWallets = wallets.filter(
    (wallet) =>
      wallet.adapter.name.toLowerCase() === 'phantom' ||
      wallet.adapter.name.toLowerCase() === 'backpack'
  );

  useEffect(() => {
    setShowOption(false);
  }, []);

  return (
    <>
      <div>
        {loading ? (
          <ListLoad />
        ) : (
          <div
            style={{
              maxHeight: '450px',
              transition: 'max-height 0.5s ease',
              overflow: 'hidden',
            }}
            className="flex flex-col"
          >
            {/* {phantomWallet && (
              <BaseCard
                key={phantomWallet.adapter.name}
                onClick={() => handleConnectPhantom(phantomWallet.adapter.name)}
                network={phantomWallet.adapter}
              />
            )} */}

            {magicAuthProviders.map((auth) => (
              <MagicCard
                key={auth.provider}
                provider={auth.provider as LoginProvider}
                name={auth.name}
                icon={auth.icon}
              />
            ))}

            <div className="itmes-center my-3 flex w-full items-center gap-x-1">
              <div className="h-[1px] w-full bg-black/10 dark:bg-white/10"></div>
              <span className="mx-2 text-base font-medium text-[#C0C0C0]">
                or
              </span>
              <div className="h-[1px] w-full bg-black/10 dark:bg-white/10"></div>
            </div>

            <div className="mx-auto flex w-fit items-center gap-x-3">
              {otherWallets.map((wallet) => (
                <BaseCard
                  key={wallet.adapter.name}
                  onClick={() => handleConnectPhantom(wallet.adapter.name)}
                  network={wallet.adapter}
                />
              ))}
            </div>
            {!showOption ? (
              <span className="mx-auto mt-4 block w-fit text-xs font-medium text-[#A1A7BB]">
                Not already a member?{' '}
                <button
                  onClick={() => setShowOption(!showOption)}
                  className=" border-b border-[#A1A7BB]"
                >
                  Sign Up Here
                </button>
              </span>
            ) : (
              <span className="mx-auto mt-4 block w-fit text-xs font-medium text-[#A1A7BB]">
                Already a member?
                <button
                  onClick={() => setShowOption(!showOption)}
                  className=" ml-1 border-b border-[#A1A7BB]"
                >
                  Sign In Here
                </button>
              </span>
            )}

            <span className="mt-[25px] text-center text-xs text-[#C0C0C0]">
              By continuing, you agree to our {' '}
              <Link className="underline" target="_blank" href="/privacy">
                Privacy Policy
              </Link>{' '}
              <br />
              and
              <Link className="ml-1 underline" target="_blank" href="/terms">
                Terms of Use
              </Link>
              .
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default WalletList;
