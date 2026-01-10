'use client';

import HeadProfile from '@/components/GlobalControl/HeadProfile';
import UserTables from '@/components/GlobalControl/Tables';
import { useMarket } from '@/context/Market';
import { useCallback, useEffect, useState } from 'react';
import api from '@/constants/api';
import type { Order } from '@/types/market';
import { useUser } from '@/context/User';
import type { UserData } from '@/types/user';
import ClaimModal from '../Markets/ClaimModal';

const ProfilePage: React.FC<{
  pageWallet: string;
  userData: UserData;
}> = ({ pageWallet, userData }) => {
  const { wallet, userLimitOrders, fetchUserLimitOrders } = useUser();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const {
    openModalPnlAfterClosePosition,
    setOpenModalPnlAfterClosePosition,
    openClaimModal,
    setOpenClaimModal,
  } = useMarket();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order>();

  const fetchUserOrders = useCallback(async (authority: string) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/user/${authority}/orders?authority=8j1MfdZmgMcG4eJxSpST44Et1BfRAyo2wAnmPLy3KVGb`
      );
      setUserOrders(response.data);
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!wallet?.publicKey.toBase58() && !pageWallet) return;
    void fetchUserOrders(pageWallet || wallet?.publicKey.toBase58() || '');
    void fetchUserLimitOrders(pageWallet || wallet?.publicKey.toBase58() || '');
  }, [wallet?.publicKey, pageWallet, fetchUserOrders, fetchUserLimitOrders]);

  const handleCloseModal = useCallback(() => {
    setOpenClaimModal(false);
    setOpenModalPnlAfterClosePosition(false);
  }, [setOpenModalPnlAfterClosePosition, setOpenClaimModal]);

  return (
    <div className="flex size-full min-h-[calc(100vh-80px)] flex-col items-center px-2 pt-6 lg:pt-14">
      {userData && (
        <div className="mx-auto h-[calc(100%-320px)] w-full max-w-[948px] pb-20 lg:pb-0">
          <HeadProfile userOrders={userOrders} userData={userData} />
          <UserTables
            orders={userOrders}
            loadingOrders={loading}
            pageWallet={pageWallet}
            limitOrders={userLimitOrders}
          />
        </div>
      )}

      {selectedOrder && (
        <>
          {openClaimModal && (
            <ClaimModal
              order={selectedOrder}
              openModal={true}
              onCloseModal={() => {
                setSelectedOrder(undefined);
                setOpenClaimModal(false);
              }}
            />
          )}

          {openModalPnlAfterClosePosition && (
            <ClaimModal
              order={selectedOrder}
              openModal={true}
              onCloseModal={handleCloseModal}
              hiddenClaim={true}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;
