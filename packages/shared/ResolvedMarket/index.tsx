'use client';

import { JetBrainsMonoFont, OrbitronFont } from '@/utils/fonts';
import { formatCurrency } from '@/utils/formatCurrency';
import { useMemo } from 'react';
import Link from 'next/link';
import ResolvedPriceChart from './ResolvedPriceChart';

// Resolved race data from Polymarket
// Source: https://polymarket.com/event/sperm-race-tristian-usc-vs-asher-ucla
const resolvedRaces: Record<string, ResolvedRaceData> = {
  'polymarket-sperm-race-1': {
    id: 'polymarket-sperm-race-1',
    title: 'Sperm Race: Tristan (USC) vs Asher (UCLA)',
    description: 'This market refers to spermracing.com competition scheduled for April 25, 2025. If the sperm of Tristan from USC wins the race this market will resolve to "Tristan (USC)". If the sperm of Asher from UCLA wins the race this market will resolve to "Asher (UCLA)".',
    volume: 328899,
    startDate: 'Apr 18, 2025',
    endDate: 'Apr 25, 2025',
    resolutionSource: 'https://www.youtube.com/watch?v=AzZdNcvKg6o',
    finalOutcome: 'Tristan (USC)',
    leftCompetitor: {
      name: 'ASHER',
      school: 'UCLA',
      logo: '/assets/img/uclalogo.png',
      image: '/assets/img/tristan.png', // Using available image
      finalOdds: 0.01, // <1%
      isWinner: false,
    },
    rightCompetitor: {
      name: 'TRISTAN',
      school: 'USC',
      logo: '/assets/img/usclogo.png',
      image: '/assets/img/asher.png', // Using available image
      finalOdds: 0.99, // >99%
      isWinner: true,
    },
    // Mock price history data - approximating the actual price movement
    priceHistory: generateMockPriceHistory(),
  },
};

type Competitor = {
  name: string;
  school: string;
  logo: string;
  image: string;
  finalOdds: number;
  isWinner: boolean;
};

type ResolvedRaceData = {
  id: string;
  title: string;
  description: string;
  volume: number;
  startDate: string;
  endDate: string;
  resolutionSource: string;
  finalOutcome: string;
  leftCompetitor: Competitor;
  rightCompetitor: Competitor;
  priceHistory: { timestamp: Date; leftPrice: number; rightPrice: number }[];
};

// Generate mock price history that shows Tristan winning
function generateMockPriceHistory() {
  const history: { timestamp: Date; leftPrice: number; rightPrice: number }[] = [];
  const startDate = new Date('2025-04-18');
  const endDate = new Date('2025-04-25');
  const days = 7;
  
  // Start at roughly 50/50, end with Tristan (right) winning at 99%
  for (let i = 0; i <= days * 24; i += 4) { // Every 4 hours
    const progress = i / (days * 24);
    const timestamp = new Date(startDate.getTime() + (i * 60 * 60 * 1000));
    
    // Simulate price movement - Tristan gradually wins
    // Add some randomness but trend toward Tristan winning
    const baseRightPrice = 0.5 + (progress * 0.49);
    const noise = (Math.random() - 0.5) * 0.1 * (1 - progress); // Less noise as we approach end
    const rightPrice = Math.min(0.99, Math.max(0.01, baseRightPrice + noise));
    const leftPrice = 1 - rightPrice;
    
    history.push({ timestamp, leftPrice, rightPrice });
  }
  
  // Ensure final price is 99/1
  history.push({
    timestamp: endDate,
    leftPrice: 0.01,
    rightPrice: 0.99,
  });
  
  return history;
}

// Crown icon component
const CrownIcon = ({ size = 24 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className="text-[#F7B519]"
  >
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
  </svg>
);

type Props = {
  raceId: string;
};

const ResolvedMarketDetail = ({ raceId }: Props) => {
  const race = resolvedRaces[raceId];

  if (!race) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className={`text-2xl mb-4 ${OrbitronFont.className}`}>Race Not Found</h1>
          <Link href="/" className="text-[#F7B519] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/" 
          className={`inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 ${JetBrainsMonoFont.className}`}
        >
          ← Back to Races
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded ${JetBrainsMonoFont.className}`}>
              RESOLVED
            </span>
            <span className={`text-white/40 text-sm ${JetBrainsMonoFont.className}`}>
              {race.endDate}
            </span>
          </div>
          <h1 className={`text-3xl lg:text-4xl font-bold ${OrbitronFont.className}`}>
            {race.title}
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-[#111] border border-[#222] rounded-lg p-6">
              <h2 className={`text-lg mb-4 text-white/80 ${JetBrainsMonoFont.className}`}>
                PRICE HISTORY
              </h2>
              <div className="h-[400px]">
                <ResolvedPriceChart 
                  priceHistory={race.priceHistory}
                  leftName={race.leftCompetitor.name}
                  rightName={race.rightCompetitor.name}
                />
              </div>
            </div>

            {/* Final Outcome */}
            <div className="mt-6 bg-[#111] border border-[#222] rounded-lg p-6">
              <h2 className={`text-lg mb-4 text-white/80 ${JetBrainsMonoFont.className}`}>
                FINAL OUTCOME
              </h2>
              <div className="flex items-center gap-4">
                <CrownIcon size={32} />
                <div>
                  <p className={`text-2xl font-bold text-[#F7B519] ${OrbitronFont.className}`}>
                    {race.finalOutcome}
                  </p>
                  <p className={`text-white/40 text-sm ${JetBrainsMonoFont.className}`}>
                    Winner with {Math.round(race.rightCompetitor.finalOdds * 100)}% final odds
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Competitors */}
            <div className="bg-[#111] border border-[#222] rounded-lg p-6">
              <h2 className={`text-lg mb-4 text-white/80 ${JetBrainsMonoFont.className}`}>
                COMPETITORS
              </h2>
              
              {/* Left Competitor */}
              <div className={`p-4 rounded-lg mb-3 ${race.leftCompetitor.isWinner ? 'bg-[#F7B519]/10 border border-[#F7B519]/30' : 'bg-white/5'}`}>
                <div className="flex items-center gap-3">
                  <img 
                    src={race.leftCompetitor.logo} 
                    alt={race.leftCompetitor.school}
                    className="w-10 h-10 object-contain"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold ${OrbitronFont.className}`}>
                        {race.leftCompetitor.name}
                      </p>
                      {race.leftCompetitor.isWinner && <CrownIcon size={16} />}
                    </div>
                    <p className={`text-white/40 text-xs ${JetBrainsMonoFont.className}`}>
                      {race.leftCompetitor.school}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${race.leftCompetitor.isWinner ? 'text-[#F7B519]' : 'text-white/60'}`}>
                      {Math.round(race.leftCompetitor.finalOdds * 100)}%
                    </p>
                    <p className={`text-white/30 text-xs ${JetBrainsMonoFont.className}`}>
                      Final
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Competitor */}
              <div className={`p-4 rounded-lg ${race.rightCompetitor.isWinner ? 'bg-[#F7B519]/10 border border-[#F7B519]/30' : 'bg-white/5'}`}>
                <div className="flex items-center gap-3">
                  <img 
                    src={race.rightCompetitor.logo} 
                    alt={race.rightCompetitor.school}
                    className="w-10 h-10 object-contain"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold ${OrbitronFont.className}`}>
                        {race.rightCompetitor.name}
                      </p>
                      {race.rightCompetitor.isWinner && <CrownIcon size={16} />}
                    </div>
                    <p className={`text-white/40 text-xs ${JetBrainsMonoFont.className}`}>
                      {race.rightCompetitor.school}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${race.rightCompetitor.isWinner ? 'text-[#F7B519]' : 'text-white/60'}`}>
                      {Math.round(race.rightCompetitor.finalOdds * 100)}%
                    </p>
                    <p className={`text-white/30 text-xs ${JetBrainsMonoFont.className}`}>
                      Final
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Stats */}
            <div className="bg-[#111] border border-[#222] rounded-lg p-6">
              <h2 className={`text-lg mb-4 text-white/80 ${JetBrainsMonoFont.className}`}>
                MARKET STATS
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`text-white/40 ${JetBrainsMonoFont.className}`}>Volume</span>
                  <span className={`font-semibold ${JetBrainsMonoFont.className}`}>{formatCurrency(race.volume)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-white/40 ${JetBrainsMonoFont.className}`}>Start Date</span>
                  <span className={`${JetBrainsMonoFont.className}`}>{race.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-white/40 ${JetBrainsMonoFont.className}`}>End Date</span>
                  <span className={`${JetBrainsMonoFont.className}`}>{race.endDate}</span>
                </div>
              </div>
            </div>

            {/* Resolution Source */}
            <div className="bg-[#111] border border-[#222] rounded-lg p-6">
              <h2 className={`text-lg mb-4 text-white/80 ${JetBrainsMonoFont.className}`}>
                RESOLUTION SOURCE
              </h2>
              <a 
                href={race.resolutionSource}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[#F7B519] hover:underline text-sm break-all ${JetBrainsMonoFont.className}`}
              >
                {race.resolutionSource}
              </a>
            </div>

            {/* Description */}
            <div className="bg-[#111] border border-[#222] rounded-lg p-6">
              <h2 className={`text-lg mb-4 text-white/80 ${JetBrainsMonoFont.className}`}>
                ABOUT
              </h2>
              <p className={`text-white/60 text-sm leading-relaxed ${JetBrainsMonoFont.className}`}>
                {race.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResolvedMarketDetail;

