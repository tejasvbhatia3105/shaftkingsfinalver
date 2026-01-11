'use client';

import { useGlobal } from '@/context/Global';
import { useMarket } from '@/context/Market';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useTriad } from '@/context/Triad';
import { useUser } from '@/context/User';
import { X, Search } from 'lucide-react';
import ConnectWallet from '../ConnectWallet';
import { MenuIcon } from '../Icons';
import LineLoading from '../LineLoading';

export function Header() {
  const { loadingGlobal, rulesModalOpen, isModalOpen } = useGlobal();
  const pathname = usePathname();
  const { getUser } = useTriad();
  const { openClaimModal } = useMarket();
  const { wallet } = useUser();
  const [showMobileNav, setShowMobileNav] = useState(false);

  const navigationLinks = [
    { name: 'HOME', link: '/', highlight: true },
    { name: 'STATISTICS', link: '/docs' },
    { name: '• LIVE', link: '/', isLive: true },
  ];

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
          'fixed left-0 z-30 h-[70px] w-full bg-black border-b border-white/10',
          {
            'z-0':
              openClaimModal ||
              (rulesModalOpen && pathname.includes('market')) ||
              (isModalOpen && pathname === '/staking'),
          }
        )}
      >
        <div className="max-w-7xl mx-auto flex h-full items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/assets/img/shaftkingslogo.png" 
              alt="ShaftKings" 
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Center Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigationLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                className={cn(
                  'text-sm font-medium tracking-wider transition-colors',
                  item.isLive 
                    ? 'text-[#ef4444]' 
                    : pathname === item.link 
                      ? 'text-[#60a5fa]' 
                      : 'text-white/70 hover:text-white'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-[200px]">
              <Search className="w-4 h-4 text-white/40 mr-2" />
              <input
                type="text"
                placeholder="SEARCH"
                className="bg-transparent text-white/60 text-sm placeholder-white/40 outline-none w-full"
              />
            </div>

            {/* Auth Buttons / Wallet */}
            {wallet?.connected ? (
              <ConnectWallet />
            ) : (
              <div className="flex items-center gap-3">
                <ConnectWallet />
              </div>
            )}

            {/* Mobile Menu */}
            <button
              className="lg:hidden text-white"
              onClick={() => setShowMobileNav(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Modal */}
      {showMobileNav && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm lg:hidden">
          <div className="flex h-full flex-col px-6 py-8">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-white text-xl font-light tracking-wide">
                <span className="italic">Shaft</span>
                <span className="text-[#c9a227] font-semibold">Kings</span>
              </span>
              <button onClick={() => setShowMobileNav(false)}>
                <X className="size-6 text-white" />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {navigationLinks.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.link}
                  onClick={() => setShowMobileNav(false)}
                  className={cn(
                    'text-lg font-medium',
                    item.isLive ? 'text-[#ef4444]' : 'text-white'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mt-8">
              <ConnectWallet />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
