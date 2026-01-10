'use client';

import { useGlobal } from '@/context/Global';
import { useMarket } from '@/context/Market';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { useTriad } from '@/context/Triad';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { useUser } from '@/context/User';
import { PoppinsFont } from '@/utils/fonts';
import { X } from 'lucide-react';
import ConnectWallet from '../ConnectWallet';
import { IconAlreadyCopy, IconAttachment, MenuIcon } from '../Icons';
import LineLoading from '../LineLoading';

export function Header() {
  const { loadingGlobal, rulesModalOpen, isModalOpen } = useGlobal();
  const [bgHeader, setBgHeader] = useState(false);
  const pathname = usePathname();
  const { connectedUser, getUser } = useTriad();
  const { openClaimModal } = useMarket();
  const [isCopied, setIsCopied] = useState(false);
  const { wallet } = useUser();
  const [showMobileNav, setShowMobileNav] = useState(false);

  const isLegal = false;

  useEffect(() => {
    const handleScroll = () => {
      setBgHeader(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationLinks = [
    { name: 'Predict Now', link: '/' },
    { name: 'Information', link: 'https://info.shaftkings.com' },
    { name: 'How it works', link: 'https://info.shaftkings.com/how-it-works' },
    { name: 'Refer & Earn', link: '/referral' },
  ];

  const handleCopy = useCallback(() => {
    copyToClipboard(`https://shaftkings.com/?ref=${connectedUser?.name}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [connectedUser?.name]);

  useEffect(() => {
    if (!wallet?.publicKey.toBase58()) return;
    void getUser(wallet?.publicKey.toBase58() || '');
  }, [getUser, wallet?.publicKey]);

  return (
    <>
      {loadingGlobal && <LineLoading />}

      <header
        id="main-header"
        className={cn(
          'fixed left-0 z-30 h-[44px] w-full border-b border-shaftkings-gray-1000 bg-black transition-all duration-200 dark:border-[#555555] lg:h-[80px]',
          PoppinsFont.className,
          {
            'bg-white dark:bg-[#13141A1A] backdrop-blur-xl': bgHeader,
            'z-0':
              openClaimModal ||
              (rulesModalOpen && pathname.includes('market')) ||
              (isModalOpen && pathname === '/staking'),
            '!bg-white': isLegal,
          }
        )}
      >
        <div className="mx-auto flex h-full items-center justify-between px-2.5 max-[768px]:py-2 lg:px-4">
          <Link href="/">
            <img
              width={82}
              height={30}
              className="relative h-[19px] w-[185px] object-contain lg:h-[24px] lg:w-[224px]"
              src={
                isLegal
                  ? '/assets/svg/shaftkings-black.svg'
                  : '/assets/svg/shaftkings-gold.svg'
              }
              alt="ShaftKings logo"
            />
          </Link>

          <div className="flex items-center gap-x-4">
            <ul className="hidden gap-x-4 lg:flex">
              {navigationLinks.map((item, idx) => (
                <li
                  className={cn(
                    'h-[42px] w-[151px] flex items-center justify-center text-xs uppercase tracking-[2px]',
                    pathname === item.link ? 'text-white' : 'text-[#C0C0C0]'
                  )}
                  key={idx}
                >
                  <Link href={item.link}>{item.name}</Link>
                </li>
              ))}
            </ul>

            {wallet?.publicKey && (
              <button
                className={cn(
                  'hidden sm:flex items-center justify-center min-w-[160px] max-w-[160px] gap-1.5 rounded px-1.5 py-0.5 text-xs font-medium transition-all',
                  isCopied
                    ? 'bg-shaftkings-green-200 text-white'
                    : 'bg-black/5 text-shaftkings-gray-600 dark:bg-white/5 dark:text-[#C0C0C0]'
                )}
                onClick={handleCopy}
              >
                {isCopied ? <IconAlreadyCopy /> : <IconAttachment />}
                {isCopied ? 'Copied!' : 'Copy Referral Link'}
              </button>
            )}

            <ConnectWallet />
            {wallet?.connected && (
              <button
                className="lg:hidden"
                onClick={() => setShowMobileNav(true)}
              >
                <MenuIcon />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Nav Modal */}
      {showMobileNav && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm lg:hidden">
          <div className="flex h-full flex-col px-6 py-8">
            <div className="mb-8 flex items-center justify-between">
              <img
                src="/assets/img/shaftkings-gold.png"
                alt="ShaftKings"
                className="h-6 w-auto"
              />
              <button onClick={() => setShowMobileNav(false)}>
                <X className="size-6 text-white" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 text-white">
              {navigationLinks.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.link}
                  onClick={() => setShowMobileNav(false)}
                  className="text-lg font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
