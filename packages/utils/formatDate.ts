import { formatDistanceToNow } from 'date-fns';

export const formatTimeAgo = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return formatDistanceToNow(date, { addSuffix: true });
};
