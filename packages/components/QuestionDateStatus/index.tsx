import { format } from 'date-fns';
import { IconClock, IconFilledClock, IconVerify } from '../Icons';
import Tooltip from '../Tooltip';

type Props = {
  date: string;
  hasResolved: boolean;
};

const QuestionDateStatus: React.FC<Props> = ({ date, hasResolved }) => {
  const endTimeDate = new Date(Number(date) * 1000);
  const currentDate = new Date();

  const formatUTCDate = (timestamp: number) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const date = new Date(Number(timestamp) * 1000);

    const year = date.getUTCFullYear();
    const month = date.toLocaleString('en-US', {
      month: 'short',
      timeZone: 'UTC',
    });
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${month} ${day}, ${year} at ${hours}:${minutes} UTC`;
  };

  if (hasResolved) {
    return (
      <div className="flex items-center gap-x-2.5">
        <IconVerify color="#A1A7BB" className="size-[18px]" />
        <span className="text-sm text-[#C0C0C0]">Resolved</span>
      </div>
    );
  }

  if (endTimeDate.getTime() <= currentDate.getTime()) {
    return (
      <div className="flex items-center gap-x-2.5">
        <Tooltip
          direction="bottom"
          tooltipMessage={
            <div className="flex flex-col gap-y-1.5 text-xs text-white/90">
              <span className="mt-1 text-white">
                The market closed on {formatUTCDate(Number(date))}
              </span>
              <span>
                After this time, the market’s context will be reviewed, and the
                outcome decided accordingly.
              </span>
              Resolution may take up to 24 hours after that.
            </div>
          }
        >
          <IconFilledClock color="#ee5f67" />
        </Tooltip>
        <span className="text-sm text-shaftkings-red-300">Ended</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1 text-[#606E85] dark:text-[#C0C0C0]">
      <Tooltip
        direction="bottom"
        tooltipMessage={
          <div className="flex flex-col items-center gap-y-2">
            <span>
              The closing time corresponds to
              <span className="mx-1">{formatUTCDate(Number(date))}</span>
            </span>
          </div>
        }
      >
        <div className="flex items-center dark:bg-transparent">
          <div className="flex items-center gap-1.5">
            <IconClock />
            End:
          </div>
        </div>
      </Tooltip>

      <span>{format(new Date(Number(date) * 1000), 'MMM dd, yyyy')}</span>
    </div>
  );
};

export default QuestionDateStatus;
