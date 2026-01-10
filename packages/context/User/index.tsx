'use client';

import { SignIn } from '@/components/SignIn';
import { Toast } from '@/components/Toast';
import api from '@/constants/api';
import { USDC_MINT } from '@/constants/mint';
import { formatBigNumber } from '@/utils/formatCurrency';
import { truncateWallet } from '@/utils/truncateWallet';
import {
  getAccount,
  getAssociatedTokenAddress,
  getMint,
} from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { OAuthRedirectResult } from '@magic-ext/oauth';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { magicAuthProviders } from '@/utils/authProviders';
import { signAllTransactions, signTransaction } from '@/utils/magicAdapter';
import { magic } from '@/lib/magic';
import type { WalletProps, LoginProvider } from '@/types/magic';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import type { BookOrder } from '@/types/market';
import { useSolana } from '../Solana';

type UserProviderProps = {
  children: ReactNode;
};

export type ContextValue = {
  signOut: () => void;
  getBalanceUSDC: () => Promise<void>;
  balanceUSDC: number;
  points: number;
  fetchPoints: () => Promise<void>;
  getBalanceSol: () => Promise<void>;
  balanceSOL: number;
  balanceORE: number;
  setBalanceUSDC: Dispatch<SetStateAction<number>>;
  setBalanceORE: Dispatch<SetStateAction<number>>;
  setBalanceSOL: Dispatch<SetStateAction<number>>;
  openUserControl: boolean;
  setOpenUserControl: Dispatch<SetStateAction<boolean>>;
  updateUser: ({
    name,
    signature,
    image,
  }: {
    name?: string;
    signature: string;
    image?: string;
  }) => Promise<void>;
  userMagic: OAuthRedirectResult | null;
  handleLogin: (provider: LoginProvider) => Promise<void>;
  loadingStorageUser: boolean;
  loadingLogin: boolean;
  wallet: WalletProps | null;
  showDisclaimer: boolean;
  setShowDisclaimer: (param: boolean) => void;
  userLimitOrders: BookOrder[];
  fetchUserLimitOrders: (authority: string) => Promise<void>;
  setUserLimitOrders: Dispatch<SetStateAction<BookOrder[]>>;
};

export const UserContext = createContext<ContextValue | undefined>(undefined);

export function UserProvider({ children, ...rest }: UserProviderProps) {
  const solanaWallet = useWallet();
  const { connection } = useSolana();
  const [points, setPoints] = useState(0);
  const [balanceUSDC, setBalanceUSDC] = useState(0);
  const [balanceSOL, setBalanceSOL] = useState(0);
  const [balanceORE, setBalanceORE] = useState(0);
  const [openUserControl, setOpenUserControl] = useState<boolean>(false);
  const [userMagic, setUserMagic] = useState<OAuthRedirectResult | null>(null);
  const [loadingStorageUser, setLoadingStorageUser] = useState<boolean>(false);
  const [loadingLogin, setloginLoading] = useState<boolean>(false);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [userLimitOrders, setUserLimitOrders] = useState<BookOrder[]>([]);
  const route = useRouter();
  const searchParams = useSearchParams();

  const fetchUserLimitOrders = useCallback(async (authority: string) => {
    try {
      const response = await api.get(
        `/user/${authority}/book-orders?authority=8j1MfdZmgMcG4eJxSpST44Et1BfRAyo2wAnmPLy3KVGb`
      );
      setUserLimitOrders(
        response.data.filter((order: BookOrder) => order.market)
      );
    } catch {
      /* empty */
    }
  }, []);

  const wallet = useMemo(() => {
    if (userMagic?.magic?.userMetadata?.publicAddress) {
      const magicData = magicAuthProviders.find(
        (p) => p.provider === userMagic.oauth.provider
      );

      return {
        publicKey: new PublicKey(userMagic.magic.userMetadata.publicAddress),
        disconnect: async () => {
          await magic?.user.logout();
        },
        connected: true,
        signAllTransactions: (txs) =>
          signAllTransactions(txs, magic, connection),
        signTransaction: (tx) => signTransaction(tx, magic, connection),
        signMessage: magic?.solana?.signMessage,
        wallet: {
          adapter: {
            name: magicData?.name,
            icon: magicData?.icon,
          },
        },
      } as WalletProps;
    }

    if (solanaWallet?.connected && solanaWallet?.publicKey) {
      return {
        ...solanaWallet,
        wallet: solanaWallet.wallet,
      } as WalletProps;
    }

    return null;
  }, [
    userMagic?.magic.userMetadata.publicAddress,
    userMagic?.oauth.provider,
    solanaWallet,
    connection,
  ]);

  const handleLogin = useCallback(async (provider: LoginProvider) => {
    if (!magic) return;

    try {
      await magic?.oauth.loginWithRedirect({
        provider,
        redirectURI: typeof window !== 'undefined' ? window.location.href : '',
      });
    } catch (error) {
      /* empty */
    }
  }, []);

  const signOut = useCallback(() => {
    void wallet?.disconnect();

    localStorage.removeItem('user-magic');
    localStorage.removeItem('walletName');
    setUserMagic(null);
    void route.push('/');
  }, [route, wallet]);

  const getStorageUser = async () => {
    if (!magic) return;

    setLoadingStorageUser(true);
    try {
      const data = localStorage.getItem('user-magic');

      if (!data) return;

      const user = JSON.parse(data) as OAuthRedirectResult;

      void magic.auth.setAuthorizationToken(user.oauth.accessToken);

      const userMetadata = await magic.user.getInfo();

      setUserMagic({
        oauth: user.oauth,
        magic: {
          idToken: user.magic.idToken,
          userMetadata,
        },
      });
    } catch (error) {
      setLoadingStorageUser(false);

      /* empty */
    } finally {
      setLoadingStorageUser(false);
    }
  };

  useEffect(() => {
    if (!magic) return;

    const fetchRedirectResult = async () => {
      setloginLoading(true);
      try {
        const res = await magic?.oauth.getRedirectResult();
        if (
          res &&
          res.magic &&
          res.magic.userMetadata &&
          res.magic.userMetadata.publicAddress
        ) {
          localStorage.setItem('user-magic', JSON.stringify(res));
          setUserMagic(res);
        }
      } catch (error) {
        /* empty */
      } finally {
        setloginLoading(false);
      }
    };

    void getStorageUser();
    void fetchRedirectResult();
  }, []);

  const walletConnected = useCallback((currentWallet: string) => {
    Toast.show({
      title: 'Wallet Connected',
      description: `Connected to wallet ${truncateWallet(currentWallet)}`,
      type: 'success',
      timeClose: 1000,
      isDropdown: false,
    });
  }, []);

  const [showToastConnected, setShowToastConnected] = useState(false);

  useEffect(() => {
    if (!wallet?.publicKey) return;

    if (showToastConnected) return;

    walletConnected(wallet?.publicKey.toBase58());
    setShowToastConnected(true);
  }, [wallet?.publicKey]);

  const getTokenBalance = useCallback(
    async (tokenAddress: string) => {
      if (!wallet?.publicKey) return 0;

      try {
        const token = await getAssociatedTokenAddress(
          new PublicKey(tokenAddress),
          wallet?.publicKey
        );

        const mint = await getMint(connection, new PublicKey(tokenAddress));

        const account = await getAccount(connection, token);

        const formattedAmount = formatBigNumber(account.amount, mint.decimals);
        return formattedAmount;
      } catch {
        /* empty */
      }
      return 0;
    },
    [connection, wallet]
  );

  const getBalanceUSDC = useCallback(async () => {
    const balance = await getTokenBalance(USDC_MINT);
    setBalanceUSDC(balance);
  }, [getTokenBalance]);

  const getBalanceSol = useCallback(async () => {
    if (!wallet?.publicKey) return;

    try {
      const balanceSol = await connection.getBalance(wallet?.publicKey);
      const amountInLamports = balanceSol / LAMPORTS_PER_SOL;

      setBalanceSOL(amountInLamports);
      // eslint-disable-next-line no-empty
    } catch {}
  }, [connection, wallet?.publicKey]);

  const fetchPoints = useCallback(async () => {
    if (!wallet?.connected) return;

    try {
      const response = await api.get(`/point/${wallet?.publicKey?.toBase58()}`);

      setPoints(response.data);
    } catch {
      /* empty */
    }
  }, [wallet?.connected, wallet?.publicKey]);

  const updateUser = useCallback(
    async ({
      name,
      signature,
      image,
    }: {
      name?: string;
      signature: string;
      image?: string;
    }) => {
      try {
        await api.patch(`/user/${wallet?.publicKey?.toBase58()}/profile`, {
          name,
          authority: '8j1MfdZmgMcG4eJxSpST44Et1BfRAyo2wAnmPLy3KVGb',
          signature,
          image,
        });
        Toast.show({
          title: 'Success to update user',
          type: 'success',
        });
      } catch (error) {
        /* empty */
      }
    },
    [wallet?.publicKey]
  );

  const checkDisclaimer = useCallback(() => {
    const isDisclaimerShown = localStorage.getItem('isShowDisclaimer');

    if (isDisclaimerShown !== 'true') {
      setShowDisclaimer(true);
    }
  }, []);

  useEffect(() => {
    if (wallet?.connected) {
      checkDisclaimer();
      void getBalanceSol();
      void getBalanceUSDC();
    }
  }, [getBalanceUSDC, getBalanceSol, wallet?.connected]);

  useEffect(() => {
    const hasRef = searchParams.get('ref');

    if (hasRef) {
      localStorage.setItem('ref', hasRef);
    }
  }, [searchParams]);

  const value = useMemo(
    () => ({
      signOut,
      balanceUSDC,
      getBalanceUSDC,
      points,
      fetchPoints,
      getBalanceSol,
      balanceSOL,
      balanceORE,
      setBalanceUSDC,
      setBalanceORE,
      setBalanceSOL,
      openUserControl,
      setOpenUserControl,
      updateUser,
      userMagic,
      handleLogin,
      loadingStorageUser,
      loadingLogin,
      wallet,
      showDisclaimer,
      setShowDisclaimer,
      userLimitOrders,
      fetchUserLimitOrders,
      setUserLimitOrders,
    }),
    [
      signOut,
      balanceUSDC,
      getBalanceUSDC,
      points,
      fetchPoints,
      getBalanceSol,
      balanceSOL,
      balanceORE,
      setBalanceUSDC,
      setBalanceORE,
      setBalanceSOL,
      openUserControl,
      setOpenUserControl,
      updateUser,
      userMagic,
      handleLogin,
      loadingStorageUser,
      loadingLogin,
      wallet,
      showDisclaimer,
      setShowDisclaimer,
      userLimitOrders,
      fetchUserLimitOrders,
      setUserLimitOrders,
    ]
  );

  return (
    <UserContext.Provider value={value} {...rest}>
      <SignIn />
      <DisclaimerModal />
      {children}
    </UserContext.Provider>
  );
}

export const useUser = (): ContextValue => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within an UserProvider');
  }

  return context;
};
