import type { Metadata } from 'next';
import ResolvedMarketDetail from '@/shared/ResolvedMarket';

export const metadata: Metadata = {
  title: 'ShaftKings | Race History',
  description: 'View resolved race details and history',
};

type Props = {
  params: { id: string };
};

export default function RacePage({ params }: Props) {
  return <ResolvedMarketDetail raceId={params.id} />;
}

