import { fetchMarkets } from '@/shared/Markets/hooks';
import type { Metadata } from 'next';
import Markets from 'packages/shared/Markets';

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
  const initialMarkets = await fetchMarkets({ status: 'all' });
  return <Markets initialMarkets={initialMarkets} />;
}
