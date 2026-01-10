// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */

import { WinningDirection, type Market } from '@/types/market';
import { cn } from '@/utils/cn';
import { getTeamColors } from '@/utils/getColors';
import { truncateText } from '@/utils/truncateWallet';
import { useEffect, useMemo, useState } from 'react';
import { getTeamFullName } from '@/utils/getTeamFullName';
import TeamLogo from '../TeamLogo';

const TeamInfo = ({
  team,
  percentage,
  idx,
  handleTeamClick,
}: {
  team: Market;
  percentage: number;
  isWinner: boolean;
  idx: number;
  handleTeamClick: (
    e: React.MouseEvent<HTMLButtonElement>,
    team: Market
  ) => void;
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setIsMobile(windowWidth < 648);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const isHypeTeam = useMemo(() => {
    return team.question === team.yesSideName;
  }, [team.question, team.yesSideName]);

  return (
    <div
      className={cn(
        'mb-2 relative flex items-center justify-between',
        {
          'pointer-events-none':
            team.winningDirection !== WinningDirection.NONE,
        },
        team.winningDirection === WinningDirection.NONE
          ? 'opacity-100'
          : team.winningDirection === WinningDirection.HYPE && isHypeTeam
          ? 'opacity-100'
          : team.winningDirection === WinningDirection.FLOP && !isHypeTeam
          ? 'opacity-100'
          : 'opacity-20'
      )}
    >
      <div className="flex flex-col min-[375px]:flex-row min-[375px]:items-center">
        <div
          className={cn('flex items-center gap-x-2', {
            'flex-row-reverse': isMobile && idx === 1,
          })}
        >
          <TeamLogo
            name={team.question}
            primaryColor={getTeamColors(team.question)?.primary || ''}
            secondaryColor={getTeamColors(team.question)?.secondary || ''}
          />
          <div>
            <div
              className={cn(
                'max-w-[130px] whitespace-nowrap text-xs font-medium md:text-sm',
                { 'text-right': isMobile && idx === 1 }
              )}
            >
              {isMobile
                ? truncateText(getTeamFullName(team.question), 14)
                : getTeamFullName(team.question)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-4">
        <div className="hidden text-lg font-bold sm:flex md:text-2xl">
          {percentage}%
        </div>
        <button
          onClick={(e) => handleTeamClick(e, team)}
          style={{
            backgroundColor: getTeamColors(team.question)?.primary,
          }}
          className={cn(
            'w-[85px] hidden sm:flex md:w-[112px] text-white h-8 md:h-10 rounded items-center justify-center hover:opacity-70 text-sm md:text-base md:leading-4 font-medium transition-all ease-in'
          )}
        >
          {team.question}
        </button>
      </div>
    </div>
  );
};

export default TeamInfo;
