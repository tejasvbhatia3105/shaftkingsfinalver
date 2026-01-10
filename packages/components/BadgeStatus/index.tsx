type StatusType = 'live' | 'ended' | 'maintenance';

interface BadgeStatusProps {
  status: StatusType;
}

const BadgeStatus: React.FC<BadgeStatusProps> = ({ status }) => {
  const statusColors: Record<
    StatusType,
    { background: string; textColor: string }
  > = {
    live: {
      background: 'bg-shaftkings-green-200',
      textColor: 'text-shaftkings-green-200',
    },
    ended: {
      background: 'bg-shaftkings-red-200',
      textColor: 'text-shaftkings-red-200',
    },
    maintenance: { background: 'bg-yellow-500', textColor: 'text-yellow-500' },
  };

  return (
    <div className="relative top-0.5 flex cursor-default flex-col items-center gap-2 py-3.5 pr-3">
      <div
        className={`size-2 animate-pulse rounded-full duration-75 ease-in-out ${statusColors[status].background}`}
        aria-label={status}
      ></div>
      <span
        className={`text-xs font-medium capitalize ${statusColors[status].textColor}`}
      >
        {status.toUpperCase()}
      </span>
    </div>
  );
};

export default BadgeStatus;
