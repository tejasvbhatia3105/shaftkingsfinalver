import type { Metadata } from 'next';
import MarketDetails from '@/shared/MarketDetails';
import { fetchMarketById } from '@/shared/Markets/hooks';
import type { PageWithId } from '@/types/params';

export async function generateMetadata({
  params,
  searchParams,
}: PageWithId): Promise<Metadata> {
  const { id } = await params;
  const param = await searchParams;

  const { question } = param;

  const formattedQuestion = Array.isArray(question)
    ? question[0].replace(/-/g, ' ')
    : question
    ? question.replace(/-/g, ' ')
    : '';

  // const marketDetails = await fetchMarketById(id);

  const marketImageUrl =
    `https://www.cricket.cricket/api/og/${id}` || '/assets/img/metadata.png';

  return {
    title: 'Cricket | Market',
    openGraph: {
      title: 'Cricket | Market',
      description: `Make your prediction on ${formattedQuestion} at Cricket.`,
      siteName: 'Cricket',
      images: [
        {
          url: marketImageUrl,
          width: 800,
          height: 619,
        },
      ],
      type: 'website',
    },
    twitter: {
      title: 'Cricket | Market',
      description: `Make your prediction on ${formattedQuestion} at Cricket.`,
      images: marketImageUrl,
      card: 'summary_large_image',
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
    },
  };
}

const Market = async ({ params }: PageWithId) => {
  const { id } = await params;
  const mainMarket = await fetchMarketById(id);
  return <MarketDetails mainMarket={mainMarket} />;
};

export default Market;
