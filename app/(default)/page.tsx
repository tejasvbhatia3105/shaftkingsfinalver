import { fetchMarketById } from '@/shared/Markets/hooks';
import type { Metadata } from 'next';
import Markets from 'packages/shared/Markets';

// Featured market ID for ShaftKings homepage
const FEATURED_MARKET_ID = '3146';

export const metadata: Metadata = {
  title: 'ShaftKings | Prediction Market',
  description: 'ShaftKings Prediction Market',
  openGraph: {
    title: 'ShaftKings | Prediction Market',
    description: 'ShaftKings Prediction Market',
    siteName: 'ShaftKings',
    type: 'website',
  },
  twitter: {
    title: 'ShaftKings | Prediction Market',
    description: 'ShaftKings Prediction Market',
    card: 'summary_large_image',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default async function Home() {
  const featuredMarket = await fetchMarketById(FEATURED_MARKET_ID);
  return <Markets initialMarkets={featuredMarket ? [featuredMarket] : []} />;
}
