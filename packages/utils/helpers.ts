import { WinningDirection } from '@/types/market';

export const marketEnded = ({
  marketEnd,
  winningDirection,
}: {
  marketEnd: string;
  winningDirection: WinningDirection;
}) => {
  const endTime = Number(marketEnd) * 1000;

  return (
    new Date().getTime() >= endTime ||
    winningDirection !== WinningDirection.NONE
  );
};
