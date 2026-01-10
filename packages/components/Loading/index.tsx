import Logo from '@/assets/img/cricket2.png';
import Image from 'next/image';

export function Loading() {
  return (
    <div className="fixed left-0 top-0 z-[999] flex size-full items-center justify-center bg-white dark:bg-shaftkings-dark-400">
      <Image
        className="animate-jump animate-duration-[3000ms] animate-infinite animate-ease-linear"
        width={180}
        height={180}
        alt="Triad logo triangle"
        src={Logo}
      />
    </div>
  );
}
