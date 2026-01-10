'use client';

/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Toast } from '@/components/Toast';
import api from '@/constants/api';
import { TRD_DECIMALS, TRD_MINT } from '@/constants/mint';
import type { UserData } from '@/types/user';
import { getPriorityFee } from '@/utils/getPriorityFee';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferCheckedInstruction,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import {
  ComputeBudgetProgram,
  Keypair,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import TriadProtocol, { createClaimData } from '@triadxyz/triad-protocol';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Order } from '@/types/market';
import { getUserData } from 'packages/hooks/useUser';
import type { Wallet } from '@coral-xyz/anchor';
import type { ClaimVault } from '@/types/claim';
import { useSearchParams } from 'next/navigation';
import { useGlobal } from '../Global';
import { useSolana } from '../Solana';
import { useUser } from '../User';

type CreateReferralParams = {
  name: string;
  referral?: string;
  email?: string;
  isWeb2?: boolean;
};

type TriadProviderProps = {
  children: ReactNode;
};

export type ContextValue = {
  triadSdk: TriadProtocol;
  createReferral: ({
    name,
    referral,
    email,
    isWeb2,
  }: CreateReferralParams) => Promise<void>;
  hasUser: boolean;
  openAccountModal: boolean;
  setOpenAccountModal: Dispatch<SetStateAction<boolean>>;
  hasNameInUse: boolean | null;
  getUser: (authority: string) => Promise<void>;
  loadingUser: boolean;
  getUserByWallet: (targetWallet: string) => Promise<UserData>;
  hasUserVerify: () => Promise<boolean>;
  claim3Trd: (stakeWallet: string) => Promise<void>;
  connectedUser: UserData | null;
  setConnectedUser: Dispatch<SetStateAction<UserData | null>>;
  isCreatingUser: boolean;
  isClaimed: boolean;
  setIsClaimed: Dispatch<SetStateAction<boolean>>;
  allOrders: Order[];
  setAllOrders: Dispatch<SetStateAction<Order[]>>;
  updateAllOrdersNonce: number;
  setUpdateAllOrdersNonce: Dispatch<SetStateAction<number>>;
  loadingAllOrders: boolean;
  setLoadingAllOrders: Dispatch<SetStateAction<boolean>>;
  claimUserVault: (row: ClaimVault) => Promise<void>;
};

export const TriadContext = createContext<ContextValue | undefined>(undefined);

export function TriadProvider({ children, ...rest }: TriadProviderProps) {
  const { wallet, userMagic } = useUser();
  const { setLoadingGlobal, setIsModalOpen } = useGlobal();
  const { connection } = useSolana();
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [hasUser, setHasUser] = useState(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [hasNameInUse] = useState<boolean | null>(null);
  const [connectedUser, setConnectedUser] = useState<UserData | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [updateAllOrdersNonce, setUpdateAllOrdersNonce] = useState(1);
  const [loadingAllOrders, setLoadingAllOrders] = useState(false);
  const [feePayer, setFeePayer] = useState<PublicKey | null>(null);
  const searchParams = useSearchParams();

  const triadSdk = useMemo(
    () =>
      new TriadProtocol(
        connection,
        {
          publicKey: wallet?.publicKey,
          signTransaction: wallet?.signTransaction,
          signAllTransactions: wallet?.signAllTransactions,
        } as Wallet,
        {
          skipPreflight: true,
          payer: feePayer || undefined,
          commitment: 'processed',
        }
      ),
    [
      wallet?.publicKey,
      wallet?.signTransaction,
      wallet?.signAllTransactions,
      connection,
      feePayer,
    ]
  );

  const getFeePayer = useCallback(async () => {
    const res = await fetch('/api/get-payer');
    const data = await res.json();
    setFeePayer(new PublicKey(data.feePayer));
  }, []);

  useEffect(() => {
    void getFeePayer();
  }, [getFeePayer]);

  const hasUserVerify = useCallback(async (): Promise<boolean> => {
    if (!wallet?.publicKey) return false;

    try {
      const { data } = await api.get(
        `/user/${wallet?.publicKey.toBase58()}/verify`
      );

      // eslint-disable-next-line @typescript-eslint/no-shadow
      const hasUser: boolean =
        data.authority && data.authority === wallet?.publicKey.toBase58();

      setHasUser(hasUser);
      return hasUser;
    } catch (error) {
      setHasUser(false);

      return false;
    } finally {
      /* empty */
    }
  }, [wallet?.publicKey]);

  const getUser = useCallback(async (authority: string) => {
    if (!authority) return;

    try {
      const response = await getUserData(authority);

      const updatedUser = {
        ...response,
      };

      setConnectedUser(updatedUser);
    } catch {
      /* empty */
    }
  }, []);

  const createReferral = useCallback(
    async ({
      name,
      referral = 'triad',
      email,
      isWeb2,
    }: CreateReferralParams) => {
      if (!wallet?.publicKey || hasUser) return;

      setLoadingGlobal(true);
      setIsCreatingUser(true);

      try {
        await api.post('/user', {
          authority: wallet.publicKey?.toBase58(),
          name,
          referral: referral || 'shaftkings',
          email,
          isWeb2,
          whitelabel: 'shaftkings',
        });

        await hasUserVerify();
        await getUser(wallet.publicKey?.toBase58());

        setOpenAccountModal(false);
        setIsModalOpen(false);
      } catch {
        /* empty */
      } finally {
        setLoadingGlobal(false);
        setIsCreatingUser(false);
      }
    },
    [
      wallet?.publicKey,
      hasUser,
      setLoadingGlobal,
      hasUserVerify,
      getUser,
      setIsModalOpen,
    ]
  );

  const getUserByWallet = useCallback(async (targetWallet: string) => {
    setLoadingUser(true);
    try {
      const response = await api.get(`/user/${targetWallet}`);

      return response.data;
    } catch {
      /* empty */
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const getTokenATA = (address: PublicKey, Mint: PublicKey) => {
    return PublicKey.findProgramAddressSync(
      [address.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), Mint.toBytes()],
      new PublicKey(ASSOCIATED_TOKEN_PROGRAM_ID)
    )[0];
  };

  const claim3Trd = useCallback(
    async (stakeWallet: string) => {
      if (!wallet?.publicKey || !wallet.signTransaction) return;

      const keyPair = Keypair.fromSecretKey(bs58.decode(stakeWallet));

      const adminATA = getTokenATA(keyPair.publicKey, new PublicKey(TRD_MINT));
      const userATA = getTokenATA(wallet?.publicKey, new PublicKey(TRD_MINT));

      const ixs = [
        createAssociatedTokenAccountIdempotentInstruction(
          wallet?.publicKey,
          userATA,
          wallet?.publicKey,
          new PublicKey(TRD_MINT),
          TOKEN_2022_PROGRAM_ID
        ),
        createTransferCheckedInstruction(
          adminATA,
          new PublicKey(TRD_MINT),
          userATA,
          keyPair.publicKey,
          50 * 10 ** 6,
          TRD_DECIMALS,
          [],
          TOKEN_2022_PROGRAM_ID
        ),
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: await getPriorityFee(),
        }),
      ];

      const tx = new Transaction().add(...ixs);

      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.feePayer = wallet?.publicKey;

      tx.sign(keyPair);

      const signedTx = await wallet.signTransaction(tx);

      await connection.sendRawTransaction(signedTx.serialize());

      setIsClaimed(true);
    },
    [connection, wallet]
  );

  const claimUserVault = useCallback(
    async (row: ClaimVault): Promise<void> => {
      try {
        const data = createClaimData(
          row.claimData.map((item) => ({
            user: item.authority,
            amount: Number(item.amount),
          }))
        );

        const userTokens = row.claimData.find(
          (item) => item.authority === wallet?.publicKey?.toBase58()
        );

        if (!userTokens) return;

        await triadSdk.claim.claimToken({
          claimData: data,
          amount: Number(userTokens?.amount),
          mint: new PublicKey(row.mint),
          claimVaultName: row.name,
          isFirstComeFirstServed: row.isFirstComeFirstServed,
        });

        Toast.show({
          title: 'Claim successful!',
          type: 'success',
        });
      } catch (error) {
        Toast.show({
          title: 'Claim failed!',
          type: 'error',
        });
        /* empty */
      }
    },
    [triadSdk.claim, wallet?.publicKey]
  );

  useEffect(() => {
    if (!wallet?.publicKey) return;
    const checkUserAndCreateReferral = async () => {
      if (hasUser) return;

      const userVerified = await hasUserVerify();

      if (userVerified) return;

      const ref = searchParams.get('ref');
      const refLocalStorage = localStorage.getItem('ref');

      const referralCode = ref || refLocalStorage || 'cricket';

      if (referralCode && wallet?.publicKey) {
        localStorage.setItem('ref', referralCode);

        const referralUser = await api.get(`/user/username/${referralCode}`);

        const isWeb2 = !!userMagic?.oauth?.provider;
        const email = userMagic?.magic?.userMetadata?.email ?? '';
        const nameFromMagic = userMagic?.oauth.userInfo.name;

        const name = nameFromMagic?.trim() || wallet.publicKey.toBase58();

        await createReferral({
          name,
          referral: referralUser.data.authority,
          isWeb2,
          email,
        });
      }
    };

    void checkUserAndCreateReferral();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, wallet?.publicKey, hasUser]);

  const value = useMemo(
    () => ({
      triadSdk,
      createReferral,
      hasUser,
      openAccountModal,
      setOpenAccountModal,
      hasNameInUse,
      hasUserVerify,
      getUser,
      getUserByWallet,
      claim3Trd,
      connectedUser,
      loadingUser,
      setConnectedUser,
      isCreatingUser,
      isClaimed,
      setIsClaimed,
      allOrders,
      setAllOrders,
      updateAllOrdersNonce,
      setUpdateAllOrdersNonce,
      loadingAllOrders,
      setLoadingAllOrders,
      claimUserVault,
    }),
    [
      triadSdk,
      createReferral,
      hasUser,
      openAccountModal,
      setOpenAccountModal,
      hasUserVerify,
      hasNameInUse,
      getUser,
      getUserByWallet,
      claim3Trd,
      connectedUser,
      loadingUser,
      setConnectedUser,
      isCreatingUser,
      isClaimed,
      setIsClaimed,
      allOrders,
      setAllOrders,
      updateAllOrdersNonce,
      setUpdateAllOrdersNonce,
      loadingAllOrders,
      setLoadingAllOrders,
      claimUserVault,
    ]
  );

  return (
    <TriadContext.Provider value={value} {...rest}>
      {children}
    </TriadContext.Provider>
  );
}

export const useTriad = (): ContextValue => {
  const context = useContext(TriadContext);

  if (context === undefined) {
    throw new Error('useTriad must be used within an TriadProvider');
  }

  return context;
};
