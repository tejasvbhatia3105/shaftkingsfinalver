import { BASE_URL } from '@/constants/api';
import type { MainMarket, MarketCategory } from '@/types/market';

type MarketFilters = {
  category?: MarketCategory;
  status?: 'active' | 'pending' | 'resolved' | 'all';
  authority?: string;
};

export const fetchMarkets = async (filters: MarketFilters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  const queryString = params.toString();
  const url = queryString
    ? `/market?authority=8j1MfdZmgMcG4eJxSpST44Et1BfRAyo2wAnmPLy3KVGb&${queryString}`
    : '/market?authority=8j1MfdZmgMcG4eJxSpST44Et1BfRAyo2wAnmPLy3KVGb';

  const response = await fetch(`${BASE_URL}${url}`, {
    next: { revalidate: 10 },
    headers: {
      'cloudflare-secret': process.env.CLOUDFLARE_SECRET!,
    },
  });

  const data = (await response.json()) as MainMarket[];

  return data;
};

export const fetchMarketById = async (id: string) => {
  const response = await fetch(`${BASE_URL}/market/${id}`, {
    next: { revalidate: 10 },
    headers: {
      'cloudflare-secret': process.env.CLOUDFLARE_SECRET!,
    },
  });

  const data = (await response.json()) as MainMarket;

  return data;
};
