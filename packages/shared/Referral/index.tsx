'use client';

import { useCallback, useEffect, useState } from 'react';
import api from '@/constants/api';
import { useUser } from '@/context/User';
import Hero from './Hero';
import StepCards from './StepCards';
import Overview from './Overview';
import UserReferrals from './UserReferrals';
import Rules from './Rules';

export type UserReferred = {
  rewards: number;
  users: {
    name: string;
    registeredAt: string;
    volume: number;
    orders: number;
  }[];
  total: number;
  volume: number;
};

const ReferralPage = () => {
  const [userReferredData, setUserReferredData] = useState<UserReferred | null>(
    null
  );
  const { wallet } = useUser();

  const getUserReferrals = useCallback(async (authority: string) => {
    try {
      const response = await api.get(`/user/${authority}/referred`);
      setUserReferredData(response.data);
    } catch (error) {
      return [];
    }
  }, []);

  useEffect(() => {
    if (wallet?.connected) {
      void getUserReferrals(wallet.publicKey.toString());
    }
  }, [wallet?.connected]);

  return (
    <div className="min-h-screen bg-black">
      <Hero />
      {/* <RefersCarousel /> */}
      <StepCards />
      <Overview userReferredData={userReferredData} />
      <UserReferrals userReferredData={userReferredData} />
      <Rules />
    </div>
  );
};

export default ReferralPage;
