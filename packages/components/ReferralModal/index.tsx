import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Button } from '../Button';
import {
  CommunityIcon,
  CommunityLightIcon,
  FinnanceIcon,
  FinnanceLightIcon,
  InviteIcon,
  InviteLightIcon,
  ReferralIcon,
} from '../Icons';
import { Modal } from '../Modal';

type Props = {
  onClose: (value: boolean) => void;
  isOpen: boolean;
};

const ReferralModal = ({ onClose, isOpen }: Props) => {
  const { theme } = useTheme();

  return (
    <Modal
      className={{ modal: 'max-w-[440px]' }}
      onClose={() => onClose(true)}
      isOpen={isOpen}
    >
      <div className="relative w-full max-w-[440px] rounded-[1px] border border-black/10 bg-[#101113] p-5 text-white shadow-lg dark:border-white/5">
        <div className="flex justify-center">
          <ReferralIcon />
        </div>

        <span className="mt-4 block text-center text-2xl font-bold text-black dark:text-white">
          Start Referring Friends!
        </span>
        <p className="dark:text-triad-dark-150 mt-1 text-center text-xs font-medium text-[#606E85]">
          Rewards for every friend you bring.
        </p>

        <div className="mt-6 flex items-center justify-between px-3">
          {theme === 'light' ? <InviteLightIcon /> : <InviteIcon />}
          <div className="mx-2 h-px flex-1 bg-black/10 dark:bg-white/10" />
          {theme === 'light' ? <CommunityLightIcon /> : <CommunityIcon />}
          <div className="mx-2 h-px flex-1 bg-black/10 dark:bg-white/10" />
          {theme === 'light' ? <FinnanceLightIcon /> : <FinnanceIcon />}
        </div>

        <div className="mt-3 flex justify-between px-1">
          <span className="w-1/3 text-left text-xs font-semibold text-black dark:text-white">
            Invite Others
          </span>
          <span className="w-1/3 text-center text-xs font-semibold text-black dark:text-white">
            They Join and Predict
          </span>
          <span className="w-1/3 text-right text-xs font-semibold text-[#00B471]">
            Earn Rewards
          </span>
        </div>

        <Button
          variant="contained"
          color="gold"
          className="mt-6 h-[46px] w-full font-semibold"
          onClick={() => {}}
        >
          Become a Referrer
        </Button>

        <p className="text-triad-dark-150 mt-4 text-center text-xs">
          By continuing, you agree to our{' '}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          <br /> and{' '}
          <Link href="/terms" className="underline">
            Terms of Use
          </Link>
          .
        </p>
      </div>
    </Modal>
  );
};

export default ReferralModal;
