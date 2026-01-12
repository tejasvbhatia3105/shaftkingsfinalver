'use client';

import { JetBrainsMonoFont, OrbitronFont } from '@/utils/fonts';
import { formatCurrency } from '@/utils/formatCurrency';
import Link from 'next/link';

type PreviousRace = {
  id: string;
  title: string;
  volume: number;
  endDate: string;
  leftCompetitor: {
    name: string;
    school: string;
    logo: string;
    isWinner: boolean;
  };
  rightCompetitor: {
    name: string;
    school: string;
    logo: string;
    isWinner: boolean;
  };
};

// Crown icon component
const CrownIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className="text-[#F7B519]"
  >
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
  </svg>
);

// Resolved race data from Polymarket
// Source: https://polymarket.com/event/sperm-race-tristian-usc-vs-asher-ucla
// Final outcome: Tristan (USC) won with >99% 
// Volume: $328,899
const previousRaces: PreviousRace[] = [
  {
    id: 'polymarket-sperm-race-1',
    title: 'Sperm Race: Tristan (USC) vs Asher (UCLA)',
    volume: 328899,
    endDate: 'Apr 25, 2025',
    leftCompetitor: {
      name: 'ASHER',
      school: 'UCLA',
      logo: '/assets/img/uclalogo.png',
      isWinner: false, // Asher lost
    },
    rightCompetitor: {
      name: 'TRISTAN',
      school: 'USC',
      logo: '/assets/img/usclogo.png',
      isWinner: true, // Tristan won
    },
  },
];

const PreviousRaces = () => {
  const races = previousRaces;

  if (races.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      {/* Section Title */}
      <h2 className={`text-white/60 text-sm tracking-[0.3em] uppercase mb-4 ${JetBrainsMonoFont.className}`}>
        PREVIOUS RACES
      </h2>

      {/* Races Grid */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {races.map((race) => (
          <Link
            key={race.id}
            href={`/race/${race.id}`}
            className="flex-shrink-0 w-[450px] bg-[#111] border border-[#222] rounded-lg overflow-hidden hover:border-[#444] hover:bg-[#151515] transition-all cursor-pointer"
          >
            <div className="flex items-stretch">
              {/* Left Competitor */}
              <div className="flex-1 flex items-center gap-3 p-4 border-r border-[#222]">
                <img 
                  src={race.leftCompetitor.logo} 
                  alt={race.leftCompetitor.school}
                  className="w-10 h-10 object-contain"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-white text-sm font-semibold ${OrbitronFont.className}`}>
                      {race.leftCompetitor.name}
                    </p>
                    {race.leftCompetitor.isWinner && <CrownIcon />}
                  </div>
                  <p className={`text-white/40 text-xs uppercase tracking-wider ${JetBrainsMonoFont.className}`}>
                    {race.leftCompetitor.school}
                  </p>
                </div>
              </div>

              {/* Right Competitor */}
              <div className="flex-1 flex items-center gap-3 p-4">
                <img 
                  src={race.rightCompetitor.logo} 
                  alt={race.rightCompetitor.school}
                  className="w-10 h-10 object-contain"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-white text-sm font-semibold ${OrbitronFont.className}`}>
                      {race.rightCompetitor.name}
                    </p>
                    {race.rightCompetitor.isWinner && <CrownIcon />}
                  </div>
                  <p className={`text-white/40 text-xs uppercase tracking-wider ${JetBrainsMonoFont.className}`}>
                    {race.rightCompetitor.school}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Volume Footer */}
            <div className="px-4 py-2 border-t border-[#222] bg-[#0a0a0a]">
              <p className={`text-white/30 text-xs ${JetBrainsMonoFont.className}`}>
                VOL: {formatCurrency(race.volume)} • {race.endDate}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PreviousRaces;
