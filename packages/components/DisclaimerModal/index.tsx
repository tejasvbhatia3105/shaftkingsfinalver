import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGlobal } from '@/context/Global';
import { useUser } from '@/context/User';
import { cn } from '@/utils/cn';
import { PoppinsFont } from '@/utils/fonts';
import { Button } from '../Button';
import { Modal } from '../Modal';

type CheckProps = {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
};

const TermsCheckbox = ({ isChecked, setIsChecked }: CheckProps) => {
  const handleChange = () => setIsChecked(!isChecked);

  return (
    <div className="mt-5 flex items-start gap-x-2.5">
      <div
        className={`size-4 min-h-4 min-w-4 cursor-pointer justify-center rounded-sm border ${
          isChecked
            ? 'border-transparent bg-blue-600'
            : 'border-black/20 bg-transparent dark:border-white/70'
        }`}
        onClick={handleChange}
      >
        {isChecked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-triad-dark-100 size-4 dark:text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <label
        className="-mt-[1px] cursor-pointer text-xs font-medium"
        onClick={handleChange}
      >
        I confirm that I’m not in a restricted jurisdiction and that my use of
        ShaftKings complies with local laws, including those on prediction
        markets.
      </label>
    </div>
  );
};

export const DisclaimerModal = () => {
  const currentDate = new Date();
  const wallet = useWallet();
  const { showDisclaimer, setShowDisclaimer } = useUser();
  const [loading, setLoading] = useState(false);
  const { setIsModalOpen } = useGlobal();
  const [isChecked, setIsChecked] = useState(false);
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    const setBodyOverflow = (isHidden: boolean) => {
      document.body.style.overflow = isHidden ? 'hidden' : '';
      document.documentElement.style.overflow = isHidden ? 'hidden' : '';
    };

    setBodyOverflow(showDisclaimer);

    return () => setBodyOverflow(false);
  }, [showDisclaimer]);

  const handleConfirmAgree = useCallback(() => {
    // if (wallet?.publicKey && wallet?.signMessage) {
    //   const messageData: Uint8Array = new TextEncoder().encode(
    //     'Join the Triad!'
    //   );

    //   try {
    //     setLoading(true);

    //     const signedMessage = await wallet.signMessage(messageData);
    //     bs58.encode(signedMessage);
    //   } catch (_) {
    //     /* empty */
    //   } finally {
    //     setLoading(false);
    //   }
    // }

    localStorage.setItem('isShowDisclaimer', 'true');
    setIsModalOpen(false);
    setShowDisclaimer(false);
  }, [setIsModalOpen, setShowDisclaimer]);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    setShowDisclaimer(false);
  }, [setIsModalOpen, setShowDisclaimer]);

  if (!showDisclaimer) return null;

  return (
    <Modal
      className={{
        modal:
          'max-h-auto size-full max-w-[490px] overflow-y-auto rounded-[1px] border border-white/5 bg-white bg-gradient-to-b from-black/90 via-black to-black pb-5 lg:max-h-fit',
      }}
      onClose={handleClose}
      isOpen={showDisclaimer && wallet?.connected}
      hiddenClose
    >
      <div className={cn('flex flex-col justify-between items-center px-5')}>
        <div className="mt-[30px] flex flex-col items-center">
          <div className="relative size-[104px] rounded-full bg-black/10 dark:bg-white/5">
            <img
              src="/assets/svg/doc-sheet.svg"
              className="absolute bottom-0 left-[14px]"
              alt=""
            />
          </div>
          <div className="mt-3 flex flex-col items-center">
            <span className="text-2xl font-bold text-[#0C131F] dark:text-white">
              Terms of Use
            </span>
            <span
              className={cn(
                'text-[13px] font-medium text-[#606E85] dark:text-[#A1A7BB]',
                PoppinsFont.className
              )}
            >
              {formattedDate}
            </span>
          </div>
        </div>
        <div
          className={cn(
            'mt-5 text-sm font-normal text-[#606E85] dark:text-white',
            PoppinsFont.className
          )}
        >
          <div className="space-y-8">
            <p>
              By using the ShaftKings platform, you confirm that you are
              complying with the laws of your country, including those regarding
              prediction markets and digital assets.
            </p>
            <p>
              If you are in the{' '}
              <Link className="text-shaftkings-gold-200" href="">
                United States
              </Link>{' '}
              or a jurisdiction where prediction markets are{' '}
              <Link className="text-shaftkings-gold-200" href="">
                prohibited
              </Link>
              , you cannot use this platform. You are responsible for ensuring
              your participation is legal. If in doubt, seek legal advice.
            </p>
            <p>
              By continuing, you confirm you are not in a restricted
              jurisdiction.
            </p>
          </div>
          <TermsCheckbox isChecked={isChecked} setIsChecked={setIsChecked} />

          <Button
            color="gold"
            loading={loading}
            onClick={handleConfirmAgree}
            className="mt-[18px] h-[46px] w-full rounded-md bg-shaftkings-gold-200 text-center text-sm font-semibold text-black hover:bg-shaftkings-gold-200"
          >
            Agree and Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
};
