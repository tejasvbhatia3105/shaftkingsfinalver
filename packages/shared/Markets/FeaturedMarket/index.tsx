'use client';

import type { MainMarket, Market, MarketPrice } from '@/types/market';
import { formatCurrency } from '@/utils/formatCurrency';
import { OrbitronFont, JetBrainsMonoFont } from '@/utils/fonts';
import { format } from 'date-fns';
import Link from 'next/link';
import { useMemo, useEffect, useState } from 'react';
import PriceChart from './PriceChart';

type FeaturedMarketProps = {
  data: MainMarket;
};

const FeaturedMarket: React.FC<FeaturedMarketProps> = ({ data }) => {
  const market = data.markets?.[0] as Market | undefined;
  const [priceHistory, setPriceHistory] = useState<MarketPrice[]>([]);

  useEffect(() => {
    if (!market?.id) return;
    
    fetch(`/api/market-prices/${market.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPriceHistory(data || []);
      })
      .catch((err) => {
        console.error('Failed to fetch price history:', err);
      });
  }, [market?.id]);

  const marketEndTime = useMemo(() => {
    if (!market?.marketEnd) return 0;
    return Number(market.marketEnd) * 1000;
  }, [market?.marketEnd]);

  const formattedDate = useMemo(() => {
    if (!market?.marketEnd) return 'AUGUST 28';
    try {
      return format(new Date(marketEndTime), 'MMMM d').toUpperCase();
    } catch {
      return 'AUGUST 28';
    }
  }, [marketEndTime, market?.marketEnd]);

  const formattedTime = useMemo(() => {
    if (!market?.marketEnd) return '2:30PM PST';
    try {
      return format(new Date(marketEndTime), 'h:mma').toUpperCase() + ' PST';
    } catch {
      return '2:30PM PST';
    }
  }, [marketEndTime, market?.marketEnd]);

  // Calculate prices and potential returns
  // hypePrice and flopPrice from API are already decimals (0 to 1), e.g., 0.5 = 50%
  const hypePrice = market ? Number(market.hypePrice) : 0.5;
  const flopPrice = market ? Number(market.flopPrice) : 0.5;
  
  const hypePriceCents = Math.round(hypePrice * 100);
  const flopPriceCents = Math.round(flopPrice * 100);
  
  // Return calculation: $100 invested returns $100/price if the bet wins
  const hypeReturn = hypePrice > 0 ? Math.round(100 / hypePrice) : 200;
  const flopReturn = flopPrice > 0 ? Math.round(100 / flopPrice) : 200;

  // Custom competitor names for ShaftKings display
  // TODO: These can be made dynamic per market in the future
  const hypeSideName = 'TRISTAN';
  const flopSideName = 'ASHER';
  
  // Custom market title for display
  // TODO: Can be made dynamic per market in the future
  const marketTitle = 'UCLA VS USC';

  if (!market) {
    return (
      <div className="flex items-center justify-center h-[400px] text-white/50">
        No market available
      </div>
    );
  }

  return (
    <Link 
      href={`/market/${market.id}?question=${encodeURIComponent(data.question)}`}
      className="block"
    >
      <div className="relative overflow-hidden rounded-lg border border-[#2a2a2a] h-[660px]">
        {/* Background layers */}
        {/* Main gradient background - extends to middle of slashes (~120px) */}
        <div className="absolute top-0 left-0 right-0 h-[125px] bg-gradient-to-b from-[#6a3515] via-[#4a2510] to-[#2a1508] pointer-events-none" />
        
        {/* Left fade to black */}
        <div 
          className="absolute top-0 left-0 w-[350px] h-[125px] pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #0a0a0a 0%, transparent 100%)',
          }}
        />
        
        {/* Right fade to black */}
        <div 
          className="absolute top-0 right-0 w-[350px] h-[125px] pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #0a0a0a 0%, transparent 100%)',
          }}
        />
        
        {/* Heavy noise/grain texture overlay - primary layer */}
        <div 
          className="absolute top-0 left-0 right-0 h-[125px] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.6,
            mixBlendMode: 'overlay',
          }}
        />
        
        {/* Second grain layer */}
        <div 
          className="absolute top-0 left-0 right-0 h-[125px] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.6' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
            opacity: 0.45,
            mixBlendMode: 'soft-light',
          }}
        />
        
        {/* Third grain layer for extra texture */}
        <div 
          className="absolute top-0 left-0 right-0 h-[125px] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise3)'/%3E%3C/svg%3E")`,
            opacity: 0.3,
            mixBlendMode: 'multiply',
          }}
        />
        
        {/* Black section - starts at middle of slashes */}
        <div className="absolute top-[118px] left-0 right-0 bottom-0 bg-[#0a0a0a] pointer-events-none" />
        
        {/* Left accent */}
        <div className="absolute top-0 left-0 w-[3px] h-[125px] bg-gradient-to-b from-[#c9a227] via-[#c9a227]/50 to-transparent pointer-events-none z-10" />

        {/* LEFT - Asher - large, cropped, extends to bottom */}
        {/* Blue glow behind left image */}
        <div 
          className="absolute left-[-80px] top-[60px] bottom-0 w-[420px] z-10 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.2) 30%, transparent 70%)',
          }}
        />
        <div className="absolute left-[-80px] top-[60px] bottom-0 w-[420px] z-20 pointer-events-none overflow-hidden">
          <img 
            src="/assets/img/tristan.png"
            alt="Asher"
            className="w-full h-full object-cover object-top scale-125 origin-top-right"
          />
          {/* Bottom gradient shadow - limited width to not overlap center */}
          <div 
            className="absolute bottom-0 left-0 w-[380px] h-[200px]"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)',
            }}
          />
          {/* Name with logo */}
          <div className="absolute bottom-[30px] left-[120px] flex items-center gap-3">
            <img 
              src="/assets/img/uclalogo.png" 
              alt={flopSideName} 
              className="w-12 h-12 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            />
            <div className="text-left">
              <h3 
                className={`text-white text-2xl font-bold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${OrbitronFont.className}`}
              >
                {flopSideName.toUpperCase()}
              </h3>
            </div>
          </div>
        </div>

        {/* RIGHT - Tristan - large, cropped, extends to bottom */}
        {/* Red glow behind right image */}
        <div 
          className="absolute right-[-80px] top-[60px] bottom-0 w-[420px] z-10 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0.2) 30%, transparent 70%)',
          }}
        />
        <div className="absolute right-[-80px] top-[60px] bottom-0 w-[420px] z-20 pointer-events-none overflow-hidden">
          <img 
            src="/assets/img/asher.png"
            alt="Tristan"
            className="w-full h-full object-cover object-top scale-125 origin-top-left"
          />
          {/* Bottom gradient shadow - limited width to not overlap center */}
          <div 
            className="absolute bottom-0 right-0 w-[380px] h-[200px]"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)',
            }}
          />
          {/* Name with logo */}
          <div className="absolute bottom-[30px] right-[120px] flex items-center gap-3">
            <div className="text-right">
              <h3 
                className={`text-white text-2xl font-bold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${OrbitronFont.className}`}
              >
                {hypeSideName.toUpperCase()}
              </h3>
            </div>
            <img 
              src="/assets/img/usclogo.png" 
              alt={hypeSideName} 
              className="w-12 h-12 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            />
          </div>
        </div>

        {/* CENTER CONTENT */}
        <div className="relative z-10 mx-auto max-w-[650px] px-4">
          {/* Category/Subtitle */}
          <div className="text-center pt-5">
            <p className="text-white/70 text-xs tracking-[0.35em] uppercase font-medium">
              {data.category?.toUpperCase() || 'PREDICTION MARKET'}
            </p>
          </div>

          {/* Title */}
          <div className="text-center mt-1">
            <h1 
              className={`text-5xl lg:text-[56px] font-black text-white ${OrbitronFont.className}`}
              style={{ letterSpacing: '0.03em' }}
            >
              {marketTitle.toUpperCase()}
            </h1>
            {/* Slashes - white diagonal lines, positioned so gradient cuts through middle */}
            <div className="text-white/60 text-base tracking-[0.15em] mt-3">
              {'//'.repeat(24)}
            </div>
          </div>

          {/* Chart (includes timer) */}
          <div className="mt-3 h-[320px]">
            <PriceChart 
              hypePrice={hypePrice} 
              flopPrice={flopPrice}
              yesSideName={hypeSideName}
              noSideName={flopSideName}
              priceHistory={priceHistory}
              marketEndTime={marketEndTime}
              marketId={market.id}
              formattedDate={formattedDate}
              formattedTime={formattedTime}
            />
          </div>

          {/* Betting Buttons - positioned below graph */}
          <div className={`flex gap-3 mt-14 ${JetBrainsMonoFont.className}`}>
            <button 
              className="flex-1 bg-[#1e3a5f] hover:bg-[#2a4a7f] border border-[#3b82f6]/40 text-white font-medium py-2.5 rounded text-base transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              <span className="opacity-70">{flopSideName}</span> <span className="opacity-100">{flopPriceCents}¢</span>
            </button>
            
            <button 
              className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium py-2.5 rounded text-base transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              <span className="opacity-70">{hypeSideName}</span> <span className="opacity-100">{hypePriceCents}¢</span>
            </button>
          </div>

          {/* Returns */}
          <div className={`flex mt-2 ${JetBrainsMonoFont.className}`}>
            <div className="flex-1 text-center">
              <span className="text-white/40 text-sm">$100</span>
              <span className="text-white/25 mx-2">→</span>
              <span className="text-[#4ade80] text-sm">${flopReturn}</span>
            </div>
            <div className="flex-1 text-center">
              <span className="text-white/40 text-sm">$100</span>
              <span className="text-white/25 mx-2">→</span>
              <span className="text-[#4ade80] text-sm">${hypeReturn}</span>
            </div>
          </div>

          {/* Total Volume */}
          <div className={`text-center mt-4 pb-4 ${JetBrainsMonoFont.className}`}>
            <span className="text-white/35 text-sm tracking-[0.15em] uppercase">TOTAL VOLUME </span>
            <span className="text-white text-sm">{formatCurrency(data.totalVolume || 0)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedMarket;
