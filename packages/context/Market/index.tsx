'use client';

import { OrderDirection, OrderSide } from '@triadxyz/triad-protocol';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { PublicKey, VersionedTransaction } from '@solana/web3.js';
import type { AxiosResponse } from 'axios';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { Toast } from '@/components/Toast';
import api from '@/constants/api';
import type {
  ClosePosition,
  FavoriteMarkets,
  Market,
  MainMarket,
  MarketTypeProps,
  PlaceOrderParams,
  TokenTypes,
  Order,
  OrderBook,
  BookOrder,
} from '@/types/market';
import { Direction } from '@/types/market';
import { useTransactionToast } from 'packages/hooks/transactionToast';
import { signFeeAndSendConfirm } from '@/utils/signFeeAndSendConfirm';
import { useGlobal } from '../Global';
import { useTriad } from '../Triad';
import { useUser } from '../User';

type SelectedOrder = {
  amount: number;
  price: number;
  bidOrderId: number;
  userNonce: number;
};

type MarketProviderProps = {
  children: ReactNode;
};

export type ContextValue = {
  openModalPositions: boolean;
  setOpenModalPositions: (value: boolean) => void;
  selectedMarket: Market | null;
  setSelectedMarket: Dispatch<SetStateAction<Market | null>>;
  allMarkets: MainMarket[];
  setAllMarkets: Dispatch<SetStateAction<MainMarket[]>>;
  allCompleteMarkets: MainMarket[];
  openModalPnlAfterClosePosition: boolean;
  setOpenModalPnlAfterClosePosition: (param: boolean) => void;
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  marketBidOrder: (data: {
    marketId: number;
    amount: number;
    direction: Direction;
  }) => Promise<VersionedTransaction | undefined>;
  closePosition: ({
    marketId,
    positionIndex,
    orderDirection,
  }: ClosePosition) => Promise<void>;
  getYesNoPrice: (orderBook: OrderBook) => {
    yesPrice: number;
    noPrice: number;
  };
  claimPayoutOrder: (
    order: {
      marketId: number;
      orderId: number;
      userNonce: number;
      mint: PublicKey;
      isTrdPayout: boolean;
      shares: number;
      orderDirection: Direction;
    }[],
    positionIndex?: number
  ) => Promise<void>;
  loadingClaimOrder: boolean;
  loadingOpenPosition: boolean;
  loadingClosePositionIndex: null | number;
  tokenSelected: TokenTypes;
  setTokenSelected: Dispatch<SetStateAction<TokenTypes>>;
  loadingClaimOrderPosition: null | number;
  getMarketOffchainData: (id: string) => Market | undefined;
  fetchMarketById: (marketId: string) => Promise<void>;
  selectedOrder: Order | undefined;
  setSelectedOrder: (value: Order | undefined) => void;
  openMobileDeposit: boolean;
  setOpenMobileDeposit: (param: boolean) => void;
  openClaimModal: boolean;
  setOpenClaimModal: (value: boolean) => void;
  calculatePotentialProfit: (
    amount: number | undefined,
    numberShares: number,
    market: Market,
    currentOption: string
  ) => number;
  currentMarketType: MarketTypeProps;
  setCurrentMarketType: (param: MarketTypeProps) => void;
  activeMarketFilter: string;
  setActiveMarketFilter: (value: string) => void;
  selectedTradeOption: 'Market' | 'Limit';
  setSelectedTradeOption: (param: 'Market' | 'Limit') => void;
  placeOrder: ({
    marketId,
    amount,
    price,
    direction,
    orderSide,
    bidOrderId,
    bidNonce,
  }: PlaceOrderParams) => Promise<VersionedTransaction | undefined>;
  selectedSubfilter: string | null;
  setSelectedSubfilter: Dispatch<SetStateAction<string | null>>;
  fetchUserFavoriteMarkets: (authority: string) => Promise<void>;
  toggleFavoriteMarket: (marketId: string) => Promise<boolean>;
  loadingFavoriteState: { [marketId: string]: boolean };
  userFavoriteMarkets: FavoriteMarkets[] | null;
  setUserFavoriteMarkets: (markets: FavoriteMarkets[]) => void;
  cancelOrder: ({
    order,
    index,
  }: {
    order: BookOrder;
    index: number;
  }) => Promise<void>;
  openMarketAskOrder: (data: {
    marketId: number;
    shares: number;
    direction: Direction;
    orders: Order[];
  }) => Promise<VersionedTransaction | undefined>;
  selectedBuySellTab: number;
  setSelectedBuySellTab: Dispatch<SetStateAction<number>>;
  modalSharePosition: boolean;
  setModalSharePosition: Dispatch<SetStateAction<boolean>>;
};

export const MarketContext = createContext<ContextValue | undefined>(undefined);

export function MarketProvider({ children, ...rest }: MarketProviderProps) {
  const { wallet, setUserLimitOrders, userLimitOrders } = useUser();
  const { setLoadingGlobal } = useGlobal();
  const { triadSdk } = useTriad();
  const [openModalPositions, setOpenModalPositions] = useState(false);
  const [openClaimModal, setOpenClaimModal] = useState(false);
  const [loadingFavoriteState, setLoadingFavoriteState] = useState<{
    [id: string]: boolean;
  }>({});
  const [activeMarketFilter, setActiveMarketFilter] = useState('Trending');
  const [userFavoriteMarkets, setUserFavoriteMarkets] = useState<
    FavoriteMarkets[] | null
  >(null);
  const [openMobileDeposit, setOpenMobileDeposit] = useState(false);
  const [selectedTradeOption, setSelectedTradeOption] = useState<
    'Market' | 'Limit'
  >('Market');
  const [loadingClaimOrderPosition, setLoadingClaimOrderPosition] = useState<
    null | number
  >(null);
  const [allMarkets, setAllMarkets] = useState<MainMarket[]>([]);
  const [loadingClaimOrder, setLoadingClaimOrder] = useState<boolean>(false);
  const [currentMarketType, setCurrentMarketType] =
    useState<MarketTypeProps>('explore');
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [selectedOption, setSelectedOption] = useState('Yes');
  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const [loadingOpenPosition, setLoadingOpenPosition] = useState(false);
  const [openModalPnlAfterClosePosition, setOpenModalPnlAfterClosePosition] =
    useState<boolean>(false);
  const [loadingClosePositionIndex, setLoadingClosePositionIndex] = useState<
    null | number
  >(null);
  const [tokenSelected, setTokenSelected] = useState<TokenTypes>('TRD');
  const [allCompleteMarkets] = useState<MainMarket[]>([]);
  const [selectedSubfilter, setSelectedSubfilter] = useState<string | null>(
    null
  );
  const [selectedBuySellTab, setSelectedBuySellTab] = useState<number>(0);
  const [modalSharePosition, setModalSharePosition] = useState<boolean>(false);

  const {
    startTransaction,
    updateToSigning,
    updateFinalStatus,
    finishWithError,
  } = useTransactionToast();

  const marketBidOrder = useCallback(
    async (data: {
      marketId: number;
      amount: number;
      direction: Direction;
    }) => {
      if (!wallet?.publicKey) return;

      setLoadingGlobal(true);
      setLoadingOpenPosition(true);

      startTransaction();

      try {
        updateToSigning();

        let tx = null;

        tx = await triadSdk.marketBidOrder({
          marketId: data.marketId,
          amount: data.amount,
          orderDirection:
            data.direction === Direction.HYPE ? { hype: {} } : { flop: {} },
          isTrdPayout: false,
        });

        if (typeof tx !== 'string') {
          await signFeeAndSendConfirm(tx, triadSdk);
          await updateFinalStatus();
          return tx;
        }

        await updateFinalStatus();
        return undefined;
      } catch (e) {
        void finishWithError(e as Error);
      } finally {
        setLoadingGlobal(false);
        setLoadingOpenPosition(false);
      }
    },
    [
      wallet?.publicKey,
      setLoadingGlobal,
      startTransaction,
      updateToSigning,
      finishWithError,
      updateFinalStatus,
      triadSdk,
    ]
  );

  const openMarketAskOrder = useCallback(
    async (data: {
      marketId: number;
      shares: number;
      direction: Direction;
      orders: Order[];
    }) => {
      if (!wallet?.publicKey) return;

      setLoadingGlobal(true);
      setLoadingOpenPosition(true);

      startTransaction();

      try {
        updateToSigning();

        let tx = null;
        const totalToSell = data.shares;
        tx = await triadSdk.marketAskOrder({
          marketId: data.marketId,
          shares: totalToSell,
          orderDirection:
            data.direction === Direction.HYPE ? { hype: {} } : { flop: {} },
        });

        if (typeof tx !== 'string') {
          await signFeeAndSendConfirm(tx, triadSdk);
          await updateFinalStatus();
          return tx;
        }

        await updateFinalStatus();
        return undefined;
      } catch (e) {
        void finishWithError(e as Error);
      } finally {
        setLoadingGlobal(false);
        setLoadingOpenPosition(false);
      }
    },
    [
      wallet?.publicKey,
      setLoadingGlobal,
      startTransaction,
      updateToSigning,
      triadSdk,
      updateFinalStatus,
      finishWithError,
    ]
  );

  const closePosition = useCallback(
    async ({ marketId, positionIndex, orderDirection }: ClosePosition) => {
      if (!wallet?.publicKey) return;

      setLoadingGlobal(true);
      setLoadingClosePositionIndex(positionIndex);

      const toastId = Toast.show({
        title: 'Processing transaction',
        isLoading: true,
        type: 'info',
        isDropdown: true,
      });

      try {
        const tx = await triadSdk.closeOrder({
          marketId: Number(marketId),
          orderDirection:
            orderDirection === Direction.HYPE ? { hype: {} } : { flop: {} },
        });

        if (typeof tx !== 'string') {
          await signFeeAndSendConfirm(tx, triadSdk);
        }
        await updateFinalStatus();

        if (toastId) {
          Toast.dismiss(toastId);
        }

        Toast.show({
          title: 'Withdraw completed',
          type: 'success',
          timeClose: 3000,
        });
      } catch (e) {
        if (toastId) {
          toast.dismiss(toastId);
        }

        Toast.show({
          title: 'Withdraw failed',
          type: 'error',
          timeClose: 3000,
        });
      } finally {
        setLoadingGlobal(false);
        setLoadingClosePositionIndex(null);
      }
    },
    [wallet?.publicKey, setLoadingGlobal, triadSdk, updateFinalStatus]
  );

  const cancelOrder = useCallback(
    async ({ order, index }: { order: BookOrder; index: number }) => {
      const isBid = order.orderSide === OrderSide.BID;

      setLoadingGlobal(true);
      setLoadingClosePositionIndex(index);

      startTransaction([
        { id: 1, label: 'Cancel Order', key: 'creating' as const },
        { id: 2, label: 'Signing Transaction', key: 'signing' as const },
        { id: 3, label: 'Order Canceled', key: 'created' as const },
      ]);

      try {
        updateToSigning();

        let tx = null;

        if (isBid) {
          tx = await triadSdk.cancelBidOrder({
            orders: [
              {
                marketId: Number(order.marketId),
                bookOrderId: Number(order.id),
                orderDirection:
                  order.orderDirection === OrderDirection.HYPE
                    ? { hype: {} }
                    : { flop: {} },
              },
            ],
          });
        } else {
          tx = await triadSdk.cancelAskOrder({
            orders: [
              {
                bookOrderId: Number(order.id),
                orderDirection:
                  order.orderDirection === OrderDirection.HYPE
                    ? { hype: {} }
                    : { flop: {} },
                marketId: Number(order.marketId),
              },
            ],
          });
        }

        if (typeof tx !== 'string') {
          await signFeeAndSendConfirm(tx, triadSdk);
        }

        await updateFinalStatus();

        setUserLimitOrders(
          userLimitOrders.filter(
            (item) =>
              !(item.id === order.id && item.marketId === order.marketId)
          )
        );

        Toast.show({
          title: 'Order canceled',
          type: 'success',
          timeClose: 3000,
        });
      } catch (error) {
        void finishWithError(error as Error);
      } finally {
        setLoadingGlobal(false);
        setLoadingClosePositionIndex(null);
      }
    },
    [
      setLoadingGlobal,
      startTransaction,
      updateToSigning,
      updateFinalStatus,
      setUserLimitOrders,
      userLimitOrders,
      triadSdk,
      finishWithError,
    ]
  );

  const claimPayoutOrder = useCallback(
    async (
      order: {
        marketId: number;
        orderId: number;
        userNonce: number;
        mint: PublicKey;
        isTrdPayout: boolean;
        shares: number;
        orderDirection: Direction;
      }[],
      positionIndex?: number
    ) => {
      if (!wallet?.publicKey) return;

      setLoadingClaimOrder(true);

      if (positionIndex !== undefined) {
        setLoadingClaimOrderPosition(positionIndex);
      }

      try {
        await triadSdk.payoutOrder(
          order.map((item) => ({
            marketId: item.marketId,
            orderDirection:
              item.orderDirection === Direction.HYPE
                ? { hype: {} }
                : { flop: {} },
            mint: item.mint,
          }))
        );

        Toast.show({
          title: 'Payout claimed!',
          type: 'success',
          timeClose: 3000,
        });
      } catch (error) {
        Toast.show({
          title: 'Claim failed!',
          type: 'error',
          timeClose: 3000,
        });
      } finally {
        setLoadingClaimOrder(false);
        setLoadingClaimOrderPosition(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [triadSdk, wallet?.publicKey]
  );

  const selectUserOrdersForSell = useCallback(
    ({
      orders,
      direction,
      totalSharesToSell,
      price,
    }: {
      orders: Order[];
      walletPubKey: string;
      direction: Direction;
      totalSharesToSell: number;
      price: number;
    }) => {
      const currentOrders = orders.filter(
        (order) => order.orderDirection === direction
      );

      const sortedOrders = [...currentOrders].sort((a, b) => a.price - b.price);

      let remainingShares = totalSharesToSell;
      const selected: SelectedOrder[] = [];

      for (const order of sortedOrders) {
        if (remainingShares <= 0) break;

        const availableShares = order.shares;
        const used = Math.min(availableShares, remainingShares);

        if (used > 0) {
          selected.push({
            amount: used,
            price,
            bidOrderId: Number(order.orderId),
            userNonce: order.userNonce,
          });

          remainingShares -= used;
        }
      }

      return {
        marketId: sortedOrders[0]?.marketId ?? '',
        orders: selected,
        direction: direction === Direction.HYPE ? { hype: {} } : { flop: {} },
      };
    },
    []
  );

  const placeOrder = useCallback(
    async ({
      marketId,
      amount,
      price,
      direction,
      orderSide,
      bidOrderId,
      bidNonce,
      orders,
    }: PlaceOrderParams) => {
      if (!selectedMarket?.mint) return;

      setLoadingGlobal(true);
      setLoadingOpenPosition(true);
      startTransaction([
        { id: 1, label: 'Creating Order', key: 'creating' as const },
        { id: 2, label: 'Signing Transaction', key: 'signing' as const },
        { id: 3, label: 'Order Created', key: 'created' as const },
      ]);

      try {
        updateToSigning();

        let tx = null;

        if (orderSide === 'bid') {
          tx = await triadSdk.placeBidOrder({
            orders: [
              {
                marketId,
                amount,
                price,
                orderDirection:
                  direction === Direction.HYPE ? { hype: {} } : { flop: {} },
              },
            ],
            isTrdPayout: false,
          });
        } else {
          if (bidOrderId === null || bidNonce === null) return undefined;

          const payload = selectUserOrdersForSell({
            orders: orders.filter(
              (item) => Number(item.marketId) === Number(marketId)
            ),
            walletPubKey: wallet?.publicKey?.toBase58() ?? '',
            direction,
            totalSharesToSell: amount,
            price,
          });

          tx = await triadSdk.placeAskOrder({
            orders: payload.orders.map((order) => ({
              amount: order.amount,
              marketId,
              orderDirection:
                direction === Direction.HYPE ? { hype: {} } : { flop: {} },
              price: order.price,
            })),
          });
        }

        if (typeof tx !== 'string') {
          await signFeeAndSendConfirm(tx, triadSdk);
          await updateFinalStatus();
          return tx;
        }

        await updateFinalStatus();
        return undefined;
      } catch (error) {
        /* empty */
        void finishWithError(error as Error);
      } finally {
        setLoadingGlobal(false);
        setLoadingOpenPosition(false);
      }
    },
    [
      selectUserOrdersForSell,
      selectedMarket?.mint,
      setLoadingGlobal,
      triadSdk,
      wallet?.publicKey,
      updateFinalStatus,
      finishWithError,
      startTransaction,
      updateToSigning,
    ]
  );

  const getMarketOffchainData = useCallback(
    (id: string) => {
      for (const marketResponse of allCompleteMarkets) {
        const foundMarket = marketResponse.markets.find(
          (market) => market.id === id
        );

        if (foundMarket) {
          return {
            ...foundMarket,
          };
        }
      }
      return undefined;
    },
    [allCompleteMarkets]
  );

  const fetchMarketById = useCallback(async (id: string) => {
    try {
      const response: AxiosResponse<MainMarket> = await api.get(
        `/market/${id}`
      );

      const poolMarkets = response.data.markets.sort(
        (a, b) => Number(b.volume) - Number(a.volume)
      );

      const activeMarkets = poolMarkets.filter(
        (item) => item.winningDirection.toLowerCase() === 'none'
      );

      const firstMarket =
        activeMarkets?.length > 0 ? activeMarkets?.[0] : poolMarkets?.[0];

      setSelectedMarket(firstMarket);
    } catch {
      /* empty */
    }
  }, []);

  const calculatePotentialProfit = useCallback(
    (
      amount: number | undefined,
      numberShares: number,
      market: Market,
      currentOption: string
    ) => {
      if (!amount) return 0;

      const isHype = currentOption === 'Yes';

      const { hypeLiquidity, flopLiquidity: flopLiquidityMarket } =
        market || {};

      const marketOppositLiquidity = isHype
        ? Number(flopLiquidityMarket)
        : Number(hypeLiquidity);

      if (!marketOppositLiquidity) return 0;

      return numberShares;
    },
    []
  );

  const fetchUserFavoriteMarkets = useCallback(async (authority: string) => {
    if (!authority) return;

    try {
      const response = await api.get(
        `/market/${authority}/get-market-favorite`
      );

      const favorites = response.data;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const favoriteMarketIds = favorites.map((fav: any) => fav.marketId);

      setUserFavoriteMarkets(response.data);

      setAllMarkets((prev) =>
        prev.map((group) => ({
          ...group,
          markets: group.markets.map((market) => ({
            ...market,
            isFavorite: favoriteMarketIds.includes(market.id),
          })),
        }))
      );

      return response.data;
    } catch {
      return null;
    }
  }, []);

  const toggleFavoriteMarket = useCallback(
    async (marketId: string) => {
      if (!wallet?.publicKey) {
        Toast.show({
          title: 'Wallet not connected',
          type: 'error',
          timeClose: 2000,
        });
        return false;
      }

      setLoadingFavoriteState((prev) => ({ ...prev, [marketId]: true }));

      const authority = wallet.publicKey.toBase58();
      const toastId = Toast.show({
        title: 'Updating favorite',
        isLoading: true,
        type: 'info',
        timeClose: 500,
        isDropdown: true,
      });

      try {
        const marketToUpdate = allMarkets
          .flatMap((group) => group.markets)
          .find((market) => market.id === marketId);

        if (!marketToUpdate) return false;

        const response = await api.patch(
          '/market/favorite-and-unfavorite-market',
          {
            marketId,
            authority,
          }
        );

        if (response.status !== 200) return false;

        const favorites = await fetchUserFavoriteMarkets(authority);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const favoriteIds = (favorites ?? []).map((fav: any) =>
          fav.marketId.toString()
        );

        const isFavoriteNow = favoriteIds.includes(marketId.toString());

        Toast.show({
          title: isFavoriteNow ? 'Added to favorites' : 'Unfavorited!',
          type: 'success',
          timeClose: 2000,
        });

        if (toastId) {
          toast.dismiss(toastId);
        }

        return false;
      } catch (error) {
        if (toastId) {
          toast.dismiss(toastId);
        }

        Toast.show({
          title: 'Could not favorite!',
          type: 'error',
          timeClose: 3000,
        });

        return false;
      } finally {
        setTimeout(() => {
          setLoadingFavoriteState((prev) => ({ ...prev, [marketId]: false }));
        }, 1500);
      }
    },
    [wallet?.publicKey, allMarkets, fetchUserFavoriteMarkets]
  );

  const getYesNoPrice = useCallback(
    (orderBook: OrderBook) => {
      if (!selectedMarket) return { yesPrice: 0, noPrice: 0 };

      const isBuy = selectedBuySellTab === 0;

      const bestYesPrice = orderBook.hype?.[isBuy ? 'ask' : 'bid']?.sort(
        (a, b) =>
          isBuy
            ? Number(a.price) - Number(b.price)
            : Number(b.price) - Number(a.price)
      )[0];

      const bestNoPrice = orderBook.flop?.[isBuy ? 'ask' : 'bid']?.sort(
        (a, b) =>
          isBuy
            ? Number(a.price) - Number(b.price)
            : Number(b.price) - Number(a.price)
      )[0];

      if (selectedMarket && Number(selectedMarket?.id) <= 310) {
        return {
          yesPrice: Number(selectedMarket.hypePrice),
          noPrice: Number(selectedMarket.flopPrice),
        };
      }

      if (selectedTradeOption === 'Limit') {
        return {
          yesPrice: Math.floor(selectedMarket.hypePrice * 1000) / 1000,
          noPrice: Math.floor(selectedMarket.flopPrice * 1000) / 1000,
        };
      }

      return {
        yesPrice: Number(bestYesPrice?.price) || 0.5,
        noPrice: Number(bestNoPrice?.price) || 0.5,
      };
    },
    [selectedBuySellTab, selectedMarket, selectedTradeOption]
  );

  const value = useMemo(
    () => ({
      openModalPositions,
      setOpenModalPositions,
      allMarkets,
      setAllMarkets,
      selectedOption,
      setSelectedOption,
      marketBidOrder,
      closePosition,
      loadingClaimOrder,
      loadingClaimOrderPosition,
      loadingOpenPosition,
      loadingClosePositionIndex,
      tokenSelected,
      setTokenSelected,
      getMarketOffchainData,
      currentMarketType,
      setCurrentMarketType,
      fetchMarketById,
      calculatePotentialProfit,
      selectedMarket,
      setSelectedMarket,
      claimPayoutOrder,
      openModalPnlAfterClosePosition,
      setOpenModalPnlAfterClosePosition,
      setSelectedOrder,
      selectedOrder,
      setOpenClaimModal,
      openClaimModal,
      selectedTradeOption,
      setSelectedTradeOption,
      allCompleteMarkets,
      openMobileDeposit,
      setOpenMobileDeposit,
      placeOrder,
      cancelOrder,
      toggleFavoriteMarket,
      fetchUserFavoriteMarkets,
      userFavoriteMarkets,
      setUserFavoriteMarkets,
      activeMarketFilter,
      setActiveMarketFilter,
      loadingFavoriteState,
      selectedSubfilter,
      setSelectedSubfilter,
      openMarketAskOrder,
      selectedBuySellTab,
      setSelectedBuySellTab,
      getYesNoPrice,
      modalSharePosition,
      setModalSharePosition,
    }),
    [
      openModalPositions,
      allMarkets,
      setAllMarkets,
      selectedOption,
      marketBidOrder,
      closePosition,
      loadingClaimOrder,
      loadingClaimOrderPosition,
      loadingOpenPosition,
      loadingClosePositionIndex,
      tokenSelected,
      getMarketOffchainData,
      currentMarketType,
      fetchMarketById,
      calculatePotentialProfit,
      selectedMarket,
      setSelectedMarket,
      claimPayoutOrder,
      openModalPnlAfterClosePosition,
      setOpenModalPnlAfterClosePosition,
      setSelectedOrder,
      selectedOrder,
      setOpenClaimModal,
      openClaimModal,
      selectedTradeOption,
      setSelectedTradeOption,
      allCompleteMarkets,
      openMobileDeposit,
      setOpenMobileDeposit,
      placeOrder,
      cancelOrder,
      toggleFavoriteMarket,
      fetchUserFavoriteMarkets,
      userFavoriteMarkets,
      setUserFavoriteMarkets,
      activeMarketFilter,
      setActiveMarketFilter,
      loadingFavoriteState,
      selectedSubfilter,
      setSelectedSubfilter,
      openMarketAskOrder,
      selectedBuySellTab,
      setSelectedBuySellTab,
      getYesNoPrice,
      modalSharePosition,
      setModalSharePosition,
    ]
  );

  return (
    <MarketContext.Provider value={value} {...rest}>
      {children}
    </MarketContext.Provider>
  );
}

export const useMarket = (): ContextValue => {
  const context = useContext(MarketContext);

  if (context === undefined) {
    throw new Error('useMarket must be used within an MarketProvider');
  }

  return context;
};
