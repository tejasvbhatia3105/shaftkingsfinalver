import { fetchMarkets } from '@/shared/Markets/hooks';
import type { Metadata } from 'next';
import Markets from 'packages/shared/Markets';

export const metadata: Metadata = {
  title: 'Cricket | Markets',
  description: '',
  openGraph: {
    title: 'Cricket | Markets',
    description: '',
    url: '',
    siteName: 'Cricket',
    images: [
      {
        url: '',
        width: 800,
        height: 500,
      },
    ],
    type: 'website',
  },
  twitter: {
    title: 'Cricket | Markets',
    description: '',
    images: '',
    card: 'summary_large_image',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  alternates: {
    canonical: '',
  },
};

export default async function Home() {
  const initialMarkets = await fetchMarkets({ status: 'all' });
  return <Markets initialMarkets={initialMarkets} />;
}
