import IncrementDecrementControl from '@/components/IncrementDecrementControl';
import { useMarket } from '@/context/Market';
import { useSolana } from '@/context/Solana';
import { useTriad } from '@/context/Triad';
import { useUser } from '@/context/User';
import Image from 'next/image';
import type {
  MainMarket,
  Market,
  Order,
  OrderBook,
  MarketType,
} from '@/types/market';
import { Direction } from '@/types/market';
import { cn } from '@/utils/cn';
import { getRemainingCooldown } from '@/utils/cooldown';
import { Geoform, InterFont } from '@/utils/fonts';
import { formatCurrency } from '@/utils/formatCurrency';
import useDebounce from '@/utils/debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { calculateOrderAvgPrice } from '@/utils/calculateOrderAvgPrice';
import { marketEnded } from '@/utils/helpers';
import { Button } from '../Button';
import Countdown from '../Countdown';
import { IconArrowBottom, IconReload, IconWallet } from '../Icons';
import LimitFields from '../LimitFields';
import PotentialProfit from '../PotentialProfit';
import { Tabs } from '../Tabs';
import { Tab, TabList } from '../Tabs/Tab';
import { ToggleButton } from '../ToggleButton';
import Tooltip from '../Tooltip';
import { Toast } from '../Toast';

type TabName = 'Buy' | 'Sell';

export type TradeCardProps = {
  market: Market;
  type?: MarketType;
};

export const formatBalance = (balance: number) => {
  const formatted = formatCurrency(balance);
  return formatted?.replace(/^\$\s*/, '');
};

const TradeCard = ({
  market,
  orders,
  orderBook,
}: {
  market: Market;
  type: MarketType;
  marketIndex: number;
  mainMarket: MainMarket;
  orders: Order[];
  orderBook: OrderBook;
}) => {
  const {
    selectedOption,
    marketBidOrder,
    selectedTradeOption,
    loadingOpenPosition,
    fetchMarketById,
    setSelectedTradeOption,
    selectedMarket,
    placeOrder,
    getYesNoPrice,
    openMarketAskOrder,
    setSelectedBuySellTab,
    selectedBuySellTab,
  } = useMarket();
  const { balanceUSDC, wallet } = useUser();
  const { setOpenConnect } = useSolana();
  const [value, setValue] = useState<number | undefined>(undefined);
  const [currentTokenBalance, setCurrentTokenBalance] = useState<number>(0);
  const { hasUser, isCreatingUser } = useTriad();
  const cardRef = useRef<HTMLDivElement>(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(0);
  const [remainingCooldown, setRemainingCooldown] = useState(() =>
    getRemainingCooldown(lastUpdateTimestamp)
  );
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [shares, setShares] = useState(0);

  const formattedValue = useMemo(() => {
    if (selectedTradeOption === 'Limit') {
      return Number(value) / 100;
    }

    return Number(value);
  }, [value, selectedTradeOption]);

  const { yesPrice, noPrice } = useMemo(() => {
    return getYesNoPrice(orderBook);
  }, [getYesNoPrice, orderBook]);

  const { yesButton, noButton } = useMemo(() => {
    return {
      yesButton: selectedMarket?.yesSideName || 'Yes',
      noButton: selectedMarket?.noSideName || 'No',
    };
  }, [selectedMarket?.noSideName, selectedMarket?.yesSideName]);

  const avgData = useMemo(() => {
    const asks =
      selectedOption === 'Yes' ? orderBook.hype.ask : orderBook.flop.ask;

    const { avgPrice, availableAmount } = calculateOrderAvgPrice(
      { ask: asks },
      formattedValue,
      wallet?.publicKey?.toBase58() as string
    );

    return {
      avgPrice,
      availableAmount,
    };
  }, [
    selectedOption,
    orderBook.hype.ask,
    orderBook.flop.ask,
    formattedValue,
    wallet?.publicKey,
  ]);

  const { sharesAvailable } = useMemo(() => {
    return orders
      .filter((item) => item.orderStatus === 'Open')
      .reduce(
        (acc, order) => {
          if (Number(order.marketId) === Number(selectedMarket?.id)) {
            if (order.orderDirection === Direction.HYPE) {
              acc.yesShares += order.shares;
            } else if (order.orderDirection === Direction.FLOP) {
              acc.noShares += order.shares;
            }
          }
          acc.sharesAvailable =
            selectedOption === 'Yes' ? acc.yesShares : acc.noShares;
          return acc;
        },
        { yesShares: 0, noShares: 0, sharesAvailable: 0 }
      );
  }, [orders, selectedMarket?.id, selectedOption]);

  const handleFetchMarketUpdate = useCallback(
    (debouncedValue: number | undefined) => {
      if (debouncedValue && debouncedValue !== formattedValue) {
        void fetchMarketById(market?.id);
      }
    },
    [fetchMarketById, market?.id, formattedValue]
  );

  useDebounce(formattedValue, handleFetchMarketUpdate, 2000);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingCooldown(getRemainingCooldown(lastUpdateTimestamp));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdateTimestamp]);

  const fetchUpdateOnMarket = useCallback(() => {
    if (loadingUpdate || remainingCooldown > 0) return;

    setLoadingUpdate(true);

    void new Promise((resolve) => {
      setTimeout(() => {
        void fetchMarketById(market?.id);

        setLastUpdateTimestamp(Date.now());
        resolve(null);
      }, 3000);
    }).finally(() => {
      setLoadingUpdate(false);
    });
  }, [fetchMarketById, loadingUpdate, market?.id, remainingCooldown]);

  const formatAmountValue = (total: number) => {
    return Number(parseFloat(total.toString()).toFixed(4));
  };

  const toggleDropdown = useCallback(() => {
    setDropdownVisible((prev) => !prev);
  }, []);

  const selectOption = useCallback(
    (option: 'Market' | 'Limit') => {
      setSelectedTradeOption(option);
      setDropdownVisible(false);
    },
    [setSelectedTradeOption]
  );

  useEffect(() => {
    if (!wallet?.publicKey) return;
    setCurrentTokenBalance(balanceUSDC || 0);
  }, [wallet?.publicKey, balanceUSDC]);

  const presetValues = useMemo(() => {
    if (selectedBuySellTab === 1 && selectedTradeOption === 'Market') {
      return [20, 50, 75, 100] as const;
    }

    return [10, 20, 50, 100, 'max'] as const;
  }, [selectedBuySellTab, selectedTradeOption]);

  const handlePresetClick = useCallback((presetValue: number) => {
    setValue((prevValue) => (prevValue || 0) + presetValue);
  }, []);

  function truncateTo2(num: number) {
    return Math.floor(num * 100) / 100;
  }

  const renderTextButton = useMemo(() => {
    const IsMarketEnd = marketEnded(market);
    const price = selectedOption === 'Yes' ? yesPrice : noPrice;

    if (!wallet?.connected) return 'Connect Wallet';

    if (isCreatingUser) return 'Loading';

    if (IsMarketEnd) return 'Not Available';

    if (!hasUser) return 'Create Account';

    const availableBalance = currentTokenBalance;

    if (selectedBuySellTab === 1 && shares > truncateTo2(sharesAvailable)) {
      return sharesAvailable
        ? `Max: ${truncateTo2(sharesAvailable)}`
        : 'Insufficient Shares';
    }

    if (
      selectedBuySellTab === 0 &&
      selectedTradeOption === 'Market' &&
      formattedValue < 1
    ) {
      return 'Min 1 USDC';
    }

    if (
      selectedBuySellTab === 0 &&
      selectedTradeOption === 'Limit' &&
      shares * formattedValue < 1
    ) {
      return 'Min 1 USDC';
    }

    if (
      shares * formattedValue > availableBalance &&
      selectedBuySellTab === 0 &&
      selectedTradeOption === 'Limit'
    ) {
      return 'Insufficient USDC';
    }

    if (formattedValue > availableBalance && selectedBuySellTab === 0) {
      return 'Insufficient USDC';
    }

    if (
      selectedBuySellTab === 0 &&
      selectedTradeOption === 'Limit' &&
      shares < 10
    ) {
      return 'Min 10 shares';
    }

    if (
      selectedBuySellTab === 1 &&
      selectedTradeOption === 'Limit' &&
      formattedValue < price
    ) {
      return `Invalid Price: Min ${price}¢`;
    }

    if (
      selectedBuySellTab === 0 &&
      selectedTradeOption === 'Limit' &&
      formattedValue > price
    ) {
      return `Invalid Price: Max ${price}¢`;
    }

    if (selectedBuySellTab === 1 && selectedTradeOption === 'Market') {
      return `Sell ${formatAmountValue(Number(formattedValue) || 0)} Shares`;
    }

    if (selectedBuySellTab === 1 && selectedTradeOption === 'Limit') {
      return `Sell ${Number(formattedValue * shares).toFixed(2) || 0} USDC`;
    }

    if (selectedBuySellTab === 0 && selectedTradeOption === 'Limit') {
      return `Buy ${Number(shares * formattedValue).toFixed(2) || 0} USDC`;
    }

    return `${
      selectedOption === 'Yes' ? yesButton : noButton
    } ${formatAmountValue(formattedValue || 0)} USDC`;
  }, [
    market,
    selectedBuySellTab,
    selectedTradeOption,
    selectedOption,
    yesPrice,
    noPrice,
    wallet?.connected,
    isCreatingUser,
    hasUser,
    shares,
    sharesAvailable,
    formattedValue,
    yesButton,
    noButton,
    currentTokenBalance,
  ]);

  const verifyButtonSubmit = useMemo(() => {
    const isLimitOrder = selectedTradeOption === 'Limit';
    const isMarketBuy =
      selectedBuySellTab === 0 && selectedTradeOption === 'Market';
    const price = selectedOption === 'Yes' ? yesPrice : noPrice;

    if (!hasUser) return true;

    if (wallet?.publicKey && !value) return true;

    const currentBalance = balanceUSDC;

    if (isLimitOrder && selectedBuySellTab === 1 && !shares) {
      return true;
    }

    if (isLimitOrder && selectedBuySellTab === 0 && shares < 10) {
      return true;
    }

    if (selectedBuySellTab === 0 && !isLimitOrder && formattedValue < 1) {
      return true;
    }

    if (
      selectedBuySellTab === 0 &&
      isLimitOrder &&
      shares * formattedValue < 1
    ) {
      return true;
    }

    if (selectedBuySellTab === 1 && isLimitOrder && formattedValue < price) {
      return true;
    }

    if (selectedBuySellTab === 0 && isLimitOrder && formattedValue > price) {
      return true;
    }

    if (isLimitOrder && selectedBuySellTab === 1 && shares > sharesAvailable) {
      return true;
    }

    if (formattedValue && formattedValue > currentBalance && isMarketBuy)
      return true;

    if (
      isLimitOrder &&
      shares * formattedValue > currentBalance &&
      selectedBuySellTab === 0
    ) {
      return true;
    }

    if (isMarketBuy && avgData?.availableAmount === 0) {
      return true;
    }

    if (loadingOpenPosition) return true;

    if (wallet?.publicKey) return false;

    return false;
  }, [
    selectedTradeOption,
    selectedBuySellTab,
    selectedOption,
    yesPrice,
    noPrice,
    hasUser,
    wallet?.publicKey,
    value,
    shares,
    formattedValue,
    sharesAvailable,
    avgData?.availableAmount,
    loadingOpenPosition,
    balanceUSDC,
  ]);

  const handleButtonSubmit = useCallback(async () => {
    if (!value || !wallet?.publicKey || !market) return;

    const formatValue = value;

    let tx = null;

    if (selectedBuySellTab === 0) {
      tx = await marketBidOrder({
        marketId: Number(market.id),
        amount: formatValue,
        direction: selectedOption === 'Yes' ? Direction.HYPE : Direction.FLOP,
      });
    } else {
      tx = await openMarketAskOrder({
        marketId: Number(market.id),
        shares: formatValue,
        direction: selectedOption === 'Yes' ? Direction.HYPE : Direction.FLOP,
        orders,
      });
    }

    if (tx) {
      setValue(undefined);
    }

    return tx;
  }, [
    value,
    wallet?.publicKey,
    market,
    selectedBuySellTab,
    marketBidOrder,
    selectedOption,
    openMarketAskOrder,
    orders,
  ]);

  const onPlaceOrder = useCallback(async () => {
    if (!formattedValue || !wallet?.publicKey || !market) return;
    const isBid = selectedBuySellTab === 0;
    const amount = isBid ? Number(shares * formattedValue) : shares;
    const openedOrder = orders.find(
      (order) =>
        Number(selectedMarket?.id) === Number(order.marketId) &&
        order.orderSide === 'Bid' &&
        order.orderStatus === 'Open'
    );

    const bidOrder = openedOrder?.orderId || null;

    if (!isBid && !openedOrder) {
      Toast.show({
        title: 'You dont have shares to sell',
        type: 'error',
      });
      return;
    }

    try {
      const tx = await placeOrder({
        marketId: Number(market?.id),
        amount,
        price: formattedValue,
        direction: selectedOption === 'Yes' ? Direction.HYPE : Direction.FLOP,
        orderSide: isBid ? 'bid' : 'ask',
        bidOrderId: isBid ? null : Number(bidOrder),
        bidNonce: isBid ? null : Number(openedOrder?.userNonce),
        orders,
      });

      if (tx) {
        setValue(0);
        setShares(0);
      }
    } catch (error) {
      /* empty */
    }
  }, [
    formattedValue,
    market,
    placeOrder,
    selectedOption,
    selectedBuySellTab,
    shares,
    orders,
    wallet?.publicKey,
    selectedMarket,
  ]);

  const handleButtonClick = useCallback(() => {
    const isLimitOrder = selectedTradeOption === 'Limit';

    if (renderTextButton === 'Not Available') return;

    if (renderTextButton === 'Create Account') return;

    if (renderTextButton === 'Connect Wallet') {
      setOpenConnect(true);
      return;
    }

    if (isLimitOrder) {
      void onPlaceOrder();
      return;
    }

    void handleButtonSubmit();
  }, [
    selectedTradeOption,
    renderTextButton,
    handleButtonSubmit,
    setOpenConnect,
    onPlaceOrder,
  ]);

  const shouldRenderPotentialProfit = useCallback((textButton: string) => {
    const hiddenStates = ['Not Available'];
    return !hiddenStates.includes(textButton);
  }, []);

  const showReceiveValue = useMemo(() => {
    if (selectedTradeOption === 'Market' && selectedBuySellTab === 1) {
      return true;
    }

    if (selectedTradeOption === 'Limit' && selectedBuySellTab === 1)
      return true;

    return false;
  }, [selectedTradeOption, selectedBuySellTab]);

  const showPotentialProfit = useMemo(() => {
    if (selectedBuySellTab === 0 && selectedTradeOption === 'Limit')
      return true;

    if (selectedTradeOption === 'Market' && selectedBuySellTab === 0)
      return true;

    if (showReceiveValue) return false;

    return false;
  }, [showReceiveValue, selectedBuySellTab, selectedTradeOption]);

  const receiveAmountValue = useMemo(() => {
    if (
      selectedTradeOption === 'Market' &&
      selectedMarket &&
      selectedBuySellTab === 1
    ) {
      const sharesPrice =
        selectedOption === yesButton
          ? selectedMarket?.hypePrice
          : selectedMarket?.flopPrice;
      return (Number(formattedValue) * sharesPrice).toFixed(2);
    }

    return Number(formattedValue * Number(shares)).toFixed(2);
  }, [
    selectedTradeOption,
    formattedValue,
    selectedMarket,
    shares,
    selectedOption,
    yesButton,
    selectedBuySellTab,
  ]);

  const renderPresetValues = useCallback(
    () => (
      <div
        className={cn(
          'w-full items-center justify-between gap-x-[7px] pt-6 lg:pt-4 flex'
        )}
      >
        {presetValues
          .filter(
            (item) => !(selectedTradeOption === 'Limit' && item === 'max')
          )
          .map((presetValue) => (
            <button
              key={presetValue}
              onClick={() => {
                if (selectedTradeOption === 'Limit') {
                  setShares(Number(presetValue) + shares);
                  return;
                }

                if (presetValue === 'max') {
                  const maxValue = balanceUSDC;

                  setValue(truncateTo2(maxValue));
                  return;
                }

                handlePresetClick(presetValue);
              }}
              className={cn(
                'flex w-full h-full max-h-[32px] items-center transition-all duration-100 bg-black/5 lg:bg-transparent dark:bg-transparent justify-center rounded-md hover:bg-black/5 dark:border border-triad-gray-1000 dark:border-white/10 dark:hover:bg-white/5 py-2 text-xs font-medium text-triad-dark-100 dark:text-white',
                {
                  'bg-triad-azure-200 text-white':
                    presetValue === formattedValue,
                }
              )}
            >
              {presetValue === 'max' ? 'MAX' : `+${presetValue}`}
            </button>
          ))}
      </div>
    ),
    [
      presetValues,
      selectedTradeOption,
      formattedValue,
      handlePresetClick,
      shares,
      balanceUSDC,
    ]
  );

  useEffect(() => {
    if (selectedTradeOption) {
      setValue(0);
      setShares(0);
    }
  }, [selectedTradeOption]);

  const tabComponents: TabName[] = useMemo(() => {
    return ['Buy', 'Sell'];
  }, []);

  const clampValue = useCallback((val: number) => {
    return val;
  }, []);

  useEffect(() => {
    if (!value) return;
    setValue(clampValue(value));
  }, [clampValue, value]);

  useEffect(() => {
    if (selectedTradeOption === 'Limit') {
      setValue(selectedOption === 'Yes' ? yesPrice * 100 : noPrice * 100);
    }
  }, [selectedOption, selectedTradeOption, yesPrice, noPrice]);

  return (
    <div className="relative size-full">
      <div
        ref={cardRef}
        className={cn(
          'max-h-[calc(100%-110px)] overflow-y-auto overflow-x-hidden xl:overflow-visible xl:ml-auto w-full xl:w-auto xl:min-w-[340px] xl:max-w-[340px]'
        )}
      >
        <div className="flex h-auto w-full flex-col rounded-[10px] border-shaftkings-gray-1000 bg-white p-2 dark:border-white/5 dark:bg-transparent lg:border lg:p-4 dark:lg:bg-white/5">
          <div className="mb-1 flex w-full items-start justify-between">
            <div className="hidden items-center gap-1 xl:flex">
              <div className="flex items-center gap-x-2">
                <img
                  width={44}
                  height={44}
                  src={market.image}
                  alt=""
                  className="size-11 max-w-[44px] rounded-[1px] object-cover"
                />
                <div>
                  <span className="text-sm font-semibold text-shaftkings-dark-100 dark:text-white">
                    {selectedMarket?.question}
                  </span>
                  <div className="flex items-center gap-x-1 text-xs text-shaftkings-gray-400 dark:text-shaftkings-dark-150">
                    Buying
                    {selectedOption === 'Yes' ? (
                      <span className="font-medium text-shaftkings-green-200">
                        {market.yesSideName || 'Yes'} Shares
                      </span>
                    ) : (
                      <span className="font-medium text-shaftkings-red-300">
                        {market.noSideName || 'No'} Shares
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-3 flex items-center">
            <Tabs
              selectedIndex={selectedBuySellTab}
              onChange={setSelectedBuySellTab}
            >
              <TabList className="mb-0 w-full border-none">
                {tabComponents.map((tab, index) => (
                  <Tab
                    className={cn(
                      'border-b text-sm m-0 px-2 py-1 pb-0.5 h-10 max-w-[60px] flex flex-1 items-center justify-center  font-medium whitespace-nowrap transition-all',
                      {
                        'm-0 font-medium !bg-transparent':
                          selectedBuySellTab === index,
                      }
                    )}
                    id={index.toString()}
                    title={tab}
                    key={index}
                  />
                ))}
              </TabList>
            </Tabs>
            <div className="relative mr-2">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-x-1 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-45 dark:text-white"
              >
                <span className={cn(InterFont.className)}>
                  {selectedTradeOption}
                </span>
                <IconArrowBottom
                  rotate={isDropdownVisible}
                  className="size-4"
                  color="#fff"
                  circle={false}
                />
              </button>

              {isDropdownVisible && (
                <div className="animate absolute top-6 z-10 w-24 animate-fade-down rounded-[1px] border border-white/10 bg-shaftkings-dark-200 shadow-2xl transition-all animate-duration-300 max-[768px]:left-2 lg:right-1">
                  <button
                    onClick={() =>
                      selectOption(
                        selectedTradeOption === 'Market' ? 'Limit' : 'Market'
                      )
                    }
                    className="block w-full px-4 py-2 text-left text-xs text-shaftkings-dark-100 hover:bg-white/5 dark:text-white"
                  >
                    {selectedTradeOption === 'Market' ? 'Limit' : 'Market'}
                  </button>
                </div>
              )}
            </div>

            <Tooltip
              className={cn({ 'pointer-events-none': loadingUpdate })}
              styleMessage="mt-4"
              direction="left"
              tooltipMessage={
                remainingCooldown > 0
                  ? 'Please wait 1 minute before the next update.'
                  : ' refresh and get the latest updates.'
              }
            >
              <button
                onClick={fetchUpdateOnMarket}
                disabled={loadingUpdate || remainingCooldown > 0}
                className={cn(
                  'flex size-5 items-center justify-center rounded border border-black/10 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10',
                  { 'dark:border-shaftkings-gold-200/60': loadingUpdate }
                )}
              >
                <IconReload loading={loadingUpdate} />
              </button>
            </Tooltip>
          </div>

          {/* <div className="mt-4 flex w-full items-start justify-between max-sm:flex-row-reverse">
             <div className="hidden gap-x-1 lg:flex">
              <h4 className="mb-3 text-sm font-medium text-shaftkings-gray-400 dark:text-white">
                Pick an Outcome
              </h4>

              <Tooltip
                direction="bottom"
                tooltipMessage={
                  <div className="flex items-center">
                    <span>
                      {'when you '}
                      <strong>pick an outcome</strong>
                      {", you're selecting the event you believe will occur. "}
                      {'Prices reflect odds of '}
                      <span className="font-extrabold text-white">
                        {`${((market?.hypePrice || 0) * 100).toFixed(
                          0
                        )}%  ${yesButton}`}
                      </span>
                      {' and '}
                      <span className="font-extrabold text-white">
                        {`${((market?.flopPrice || 0) * 100).toFixed(
                          0
                        )}% ${noButton}`}
                      </span>
                      .
                    </span>
                  </div>
                }
              >
                <IconAdviseSecondary className="relative top-0.5" />
              </Tooltip>
            </div>
          </div> */}

          <ToggleButton
            firstButtonText={yesButton}
            secondButtonText={noButton}
            setValue={(val) => {
              if (selectedTradeOption === 'Limit') {
                setValue(val * 100);
              }
            }}
            isBuy={selectedBuySellTab === 0}
            yesPrice={
              selectedTradeOption === 'Limit' ? yesPrice : yesPrice / 10 ** 6
            }
            noPrice={
              selectedTradeOption === 'Limit' ? noPrice : noPrice / 10 ** 6
            }
          />

          {selectedBuySellTab === 1 && selectedTradeOption === 'Market' ? (
            <>
              <div
                className={cn(
                  'mt-4 flex items-center justify-between min-h-[32px]'
                )}
              >
                <span
                  className={cn(
                    'hidden text-sm font-medium text-shaftkings-dark-100 dark:text-white lg:inline-flex'
                  )}
                >
                  Shares
                </span>
              </div>
            </>
          ) : (
            <>
              <div
                className={cn(
                  'mt-4 flex items-center justify-between min-h-[32px]'
                )}
              >
                <span
                  className={cn(
                    Geoform.className,
                    'hidden text-sm font-medium text-shaftkings-dark-100 dark:text-white lg:inline-flex'
                  )}
                >
                  {selectedTradeOption === 'Market' ? 'Amount' : 'Limit Price'}
                </span>

                <div className="flex items-center gap-x-1">
                  <Image
                    src="/assets/svg/USDC.svg"
                    alt=""
                    className="size-[30px] rounded lg:size-[18px]"
                    width={18}
                    height={18}
                  />
                  <span className="font-medium text-shaftkings-dark-100 dark:text-white lg:text-xs">
                    USDC
                  </span>
                </div>
              </div>
            </>
          )}

          {selectedTradeOption === 'Limit' ? (
            <LimitFields
              value={formatAmountValue(value || 0)}
              setValue={setValue}
              selectedToken="USDC"
              setShares={setShares}
              shares={shares}
              isBuy={selectedBuySellTab === 0}
            />
          ) : (
            <IncrementDecrementControl
              selectedToken={selectedBuySellTab === 0 ? 'USDC' : undefined}
              value={value || 0}
              setValue={setValue}
              initialFontSize={window.innerWidth >= 1024 ? 3.5 : 4.5}
            />
          )}

          {selectedTradeOption === 'Market' && (
            <div className="mt-4 hidden items-end justify-center lg:flex lg:items-center">
              <div className="mt-10 flex w-full flex-col items-center justify-between gap-y-2 lg:mt-0">
                <span className="whitespace-nowrap text-[13px] font-medium text-black dark:text-white">
                  <span className="text-triad-gray-400 dark:text-triad-dark-150">
                    Balance :
                  </span>{' '}
                  {selectedBuySellTab === 1
                    ? `${truncateTo2(sharesAvailable)} Shares`
                    : truncateTo2(currentTokenBalance)}
                </span>
              </div>
            </div>
          )}

          <div className={cn('w-full items-center gap-x-1 flex lg:hidden')}>
            {renderPresetValues()}
          </div>

          <div className={cn('w-full items-center gap-x-1 hidden lg:flex')}>
            {renderPresetValues()}
          </div>

          {showPotentialProfit &&
            shouldRenderPotentialProfit(renderTextButton) && (
              <PotentialProfit
                value={formattedValue || 0}
                mainMarket={market}
                selectedToken="USDC"
                shares={shares}
                orderBook={orderBook}
              />
            )}

          <div className="mt-4 flex min-h-[38px] w-full flex-row items-center justify-between gap-y-2 rounded-[10px] border border-black/10 px-[13px] dark:border-white/10 lg:mt-0 lg:hidden">
            <span className="text-triad-gray-400 dark:text-triad-dark-150 flex items-center text-[13px] font-medium">
              <IconWallet color="#C0C0C0" className="mr-[6px] size-[18px]" />
              Balance
            </span>{' '}
            <span className="text-[13px] font-semibold text-black dark:text-white">
              {selectedBuySellTab === 1
                ? `${truncateTo2(sharesAvailable)} Shares`
                : `$${truncateTo2(currentTokenBalance)}`}
            </span>
          </div>

          <>
            <Button
              onClick={handleButtonClick}
              loading={loadingOpenPosition}
              className={cn(
                Geoform.className,
                'mt-3.5 h-[50px] w-full rounded-[1px] border-transparent font-medium disabled:cursor-not-allowed  disabled:bg-black/10 uppercase'
              )}
              color="gold"
              size="large"
              disabled={verifyButtonSubmit}
            >
              {new Date().getTime() / 1000 >
              Number(selectedMarket?.marketStart) ? (
                renderTextButton
              ) : (
                <Countdown
                  className="!bg-none"
                  target={Number(selectedMarket?.marketStart)}
                  countdownEnd={async () => {
                    await fetchMarketById(market.id);
                  }}
                />
              )}
            </Button>

            {showReceiveValue && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-[#C0C0C0]">
                  {selectedBuySellTab === 0 ? 'Total' : 'You’ll receive'}
                </span>
                <span className="text-xs font-medium text-[#00B471]">
                  ${receiveAmountValue}
                </span>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default TradeCard;
