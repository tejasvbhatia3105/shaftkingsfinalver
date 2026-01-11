'use client';

import { useMemo } from 'react';
import type { MainMarket } from '@/types/market';
import { WinningDirection } from '@/types/market';
import FeaturedMarket from './FeaturedMarket';

const Markets = ({ initialMarkets }: { initialMarkets: MainMarket[] }) => {
  // Get the market with the highest volume that's still active
  const featuredMarket = useMemo(() => {
    if (initialMarkets.length === 0) return null;
    
    // Filter for active markets (not resolved) and sort by volume
    const activeMarkets = initialMarkets.filter(market => {
      // Check if at least one sub-market is not resolved
      return market.markets?.some(m => m.winningDirection === WinningDirection.NONE);
    });
    
    // Sort by total volume descending
    const sorted = [...(activeMarkets.length > 0 ? activeMarkets : initialMarkets)]
      .sort((a, b) => (b.totalVolume || 0) - (a.totalVolume || 0));
    
    console.log('Available markets:', sorted.map(m => ({
      question: m.question,
      volume: m.totalVolume,
      id: m.id
    })));
    
    return sorted[0] || initialMarkets[0];
  }, [initialMarkets]);

  return (
    <div className="relative z-20 w-full min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {featuredMarket ? (
          <FeaturedMarket data={featuredMarket} />
        ) : (
          <div className="flex items-center justify-center h-[400px] text-white/50">
            No markets available
          </div>
        )}
      </div>
    </div>
  );
};

export default Markets;
