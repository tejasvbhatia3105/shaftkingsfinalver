'use client';

import { useGlobal } from '@/context/Global';
import { useSolana } from '@/context/Solana';
import { Modal } from '../Modal';
import WalletList from './WalletList';

export function SignIn() {
  const { setIsModalOpen } = useGlobal();
  const { openConnect, setOpenConnect } = useSolana();

  if (!openConnect) return null;

  const closeModal = () => {
    setIsModalOpen(false);
    setOpenConnect(false);
  };

  return (
    <>
      <Modal
        isOpen={openConnect}
        onClose={closeModal}
        className={{
          modal: 'max-w-[450px] rounded-[1px] bg-black px-3  lg:px-0',
        }}
      >
        <div className=" h-fit w-full max-w-[450px] overflow-y-auto bg-black bg-gradient-to-b from-black/70 via-black to-black px-5 py-6">
          <img
            className="mx-auto mb-3 h-[60px] w-auto"
            src="/assets/img/shaftkingslogo.png"
            alt="ShaftKings logo"
          />

          <h3 className="mb-6 mt-2  text-center text-xl font-semibold text-shaftkings-dark-100 dark:text-white">
            Welcome to ShaftKings
          </h3>

          <WalletList closeModal={closeModal} />
        </div>
      </Modal>
    </>
  );
}
