export type TokenTypes = 'SOL' | 'TRD' | 'USDC' | 'ORE' | 'BRL';

export enum WinningDirection {
  HYPE = 'Hype',
  FLOP = 'Flop',
  DRAW = 'Draw',
  NONE = 'None',
}

export type BookOrder = {
  authority: string;
  filledShares: string;
  id: string;
  linkedBookOrderId: string;
  marketId: number;
  orderDirection: 'hype' | 'flop';
  orderSide: 'bid' | 'ask';
  price: string;
  totalShares: string;
  userNonce: string;
  market?: {
    question: string;
    id: string;
    image: string;
    yesSideName: string;
    noSideName: string;
    hypePrice: string;
    flopPrice: string;
    winningDirection: WinningDirection;
    mint: string;
    pool?: {
      id: string;
      name: string;
      image: string;
      json: string;
      type: string;
      category: string;
      deployed: boolean;
      isFast: boolean;
      coin: string | null;
    } | null;
  };
};

export type MarketTypeProps =
  | 'explore'
  | 'all'
  | 'defi'
  | 'sports'
  | 'nft-collection'
  | 'market-vote';

export enum PriceDefinition {
  TOKEN = 'TOKEN',
  SOCIAL = 'SOCIAL',
  ONCHAIN = 'ONCHAIN',
  REALMS = 'REALMS',
}

export enum MarketType {
  POOL = 'POOL',
  SINGLE = 'SINGLE',
  POOL_AGGREGATOR = 'POOL_AGGREGATOR',
}

export enum MarketCategory {
  DEFI = 'DEFI',
  NFT = 'NFT',
  FOOTBALL = 'FOOTBALL',
  POLITICS = 'POLITICS',
  SOCIAL = 'SOCIAL',
  BUSINESS = 'BUSINESS',
  GAMING = 'GAMING',
}

export type Holders = {
  name: string;
  authority: string;
  poseidonLinked: string;
  shares: number;
  image: string;
};

export type Market = {
  bump: number;
  marketAddress: string;
  authority: string;
  id: string;
  hypePrice: number;
  flopPrice: number;
  hypeLiquidity: string;
  flopLiquidity: string;
  hypeShares: string;
  flopShares: string;
  volume: string;
  mint: string;
  updateTs: string;
  nextOrderId: string;
  isFast: boolean;
  feeBps: number;
  payoutFee: number;
  marketStart: string;
  marketEnd: string;
  timestamp: string;
  question: string;
  description: string;
  type: MarketType;
  marketFeeAvailable: string;
  tags: string[];
  marketFeeClaimed: string;
  marketLiquidityAtStart: string;
  winningDirection: WinningDirection;
  totalVolume: number;
  openBets: number;
  image: string;
  outcomeSource?: string;
  poolId?: string;
  isAllowedToPayout: boolean;
  yesSideName?: string;
  noSideName?: string;
  isFavorite?: boolean;
  user?: {
    name: string;
    authority: string;
    poseidonLinked: string;
  };
};

export type MainMarket = {
  id: string;
  question: string;
  type: MarketType;
  category?: MarketCategory;
  image: string;
  coin?: string;
  markets: Market[];
  totalVolume: number;
  totalLiquidity: number;
  createdAt: string;
};

export type FavoriteMarkets = {
  id: string;
  marketId: string;
  authority: string;
  createdAt: string;
};

export type MarketPrice = {
  id: string;
  marketId: number;
  currentPrice: number;
  hypePrice: number;
  direction: 'Hype' | 'Flop';
  flopPrice: number;
  timestamp: string;
};

export type OrderDirection =
  | {
      hype: Record<string, never>;
    }
  | {
      flop: Record<string, never>;
    };
export type OrderStatus =
  | {
      init: Record<string, never>;
    }
  | {
      open: Record<string, never>;
    }
  | {
      filled: Record<string, never>;
    }
  | {
      canceled: Record<string, never>;
    }
  | {
      closed: Record<string, never>;
    };
export type OrderType =
  | {
      limit: Record<string, never>;
    }
  | {
      market: Record<string, never>;
    };

export type OpenPosition = {
  marketId: number;
  amount: number;
  direction: OrderDirection;
  token: string;
  limitPrice?: number;
};

export enum Direction {
  HYPE = WinningDirection.HYPE,
  FLOP = WinningDirection.FLOP,
}

export type ClosePosition = {
  orderId: number;
  marketId: number;
  positionIndex: number;
  userNonce: number;
  orderDirection: Direction;
};

export type MarketChartDataType = {
  price: number;
  chart: {
    time: string;
    pnl: number;
    price: { value: number; timestamp: number }[];
  }[];
};

export type User = {
  name: string;
  referral: string;
  authority: string;
  pointsMultiplier: number;
  referredPoints: number;
  points: number;
  createdAt: string;
  questsCompleted: string[];
  poseidonLinked: string;
};

export type VolumeLeaders = {
  name: string;
  amount: number;
  authority: string;
  pnl?: number | undefined;
  poseidonLinked: string;
}[];

export type QuestionStatus = 'RESOLVED' | 'UNRESOLVED';
export type QuestionDuration = 'WEEKLY';

export type Comment = {
  comment: string;
  createdAt: string;
  direction: Direction;
  authority: string;
};

export type MarketCreated = {
  image: File | null;
  question: string;
  marketEnd: string;
  marketStart: string;
  yesSideName: string;
  noSideName: string;
};

export type MarketFormData = {
  marketType: MarketType;
  image: File | null;
  question: string;
  description: string;
  markets: MarketCreated[];
};

export const baseMarket = {
  question: '',
  image: null,
  description: '',
  marketEnd: '',
  yesSideName: 'Yes',
  noSideName: 'No',
  marketStart: '',
};

export type MarketCreateResponse = {
  question: string;
  startTime: number;
  endTime: number;
  image: File | null;
  feeBps: number;
  payoutFee: number;
  description: string;
  yesSideName: string;
  noSideName: string;
};

export type Order = {
  id: string;
  authority: string;
  orderId: string;
  marketId: string;
  orderStatus: 'Open' | 'Closed';
  price: number;
  shares: number;
  orderSide: 'Bid' | 'Ask';
  orderType: 'Market';
  amount: number;
  createdAt: string;
  updatedAt: string;
  userNonce: number;
  isTrdPayout: boolean;
  orderDirection: Direction;
  market: {
    question: string;
    yesSideName: string;
    noSideName: string;
    id: string;
    image: string;
    winningDirection: WinningDirection;
    isAllowedToPayout: boolean;
    marketAddress: string;
    mint: string;
    hypePrice: string;
    flopPrice: string;
    hypeLiquidity: string;
    flopLiquidity: string;
    hypeShares: string;
    flopShares: string;
    marketEnd: string;
    marketStart: string;
    pool: {
      type: MarketType;
      name: string;
      image: string;
    } | null;
  };
};

export type OrderBook = {
  hype: {
    ask: BookOrder[];
    bid: BookOrder[];
    lastPrice: number;
  };
  flop: {
    ask: BookOrder[];
    bid: BookOrder[];
    lastPrice: number;
  };
  rewardsAvailable: string;
  rewardsClaimed: string;
  spreadToReward: string;
  marketId: number;
};

export type PlaceOrderParams = {
  marketId: number;
  amount: number;
  price: number;
  direction: Direction;
  orderSide: 'bid' | 'ask';
  bidOrderId: number | null;
  bidNonce: number | null;
  orders: Order[];
};

export type LeadersByFastMarkets = {
  name: string;
  authority: string;
  poseidonLinked: string;
  amount: number;
  pnl: number;
  prize: number;
};

export type Activity = {
  id: string;
  authority: string;
  orderId: string;
  marketId: string;
  createdAt: string;
  price: string;
  shares: string;
  userNonce: number;
  hash: string;
  orderDirection: Direction;
  orderSide: 'Bid' | 'Ask';
  orderType: 'Market' | 'Limit';
  user: {
    name: string;
    authority: string;
    poseidonLinked: string;
    image: string;
  };
  market: {
    question: string;
    yesSideName: string;
    noSideName: string;
    id: string;
    image: string;
    pool: {
      type: MarketType;
      name: string;
      image: string;
    };
  };
};
