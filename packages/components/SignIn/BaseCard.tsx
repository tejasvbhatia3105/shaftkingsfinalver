import Image from 'next/image';

type BaseCardProps = {
  network: {
    name: string;
    icon: string;
  };
  onClick: () => void;
};

export function BaseCard({ network, onClick }: BaseCardProps) {
  return (
    <button
      onClick={() => onClick()}
      className="flex h-[56px] cursor-pointer flex-row items-center justify-center gap-y-2 rounded-lg border border-black/10 px-6 text-xs font-medium dark:border-transparent dark:bg-white/5 dark:text-white dark:hover:bg-white/10 lg:text-sm"
    >
      <Image
        className=" rounded-lg"
        width={26}
        height={26}
        src={network.icon}
        alt={network.name}
      />
    </button>
  );
}
