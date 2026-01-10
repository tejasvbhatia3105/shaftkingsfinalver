export const formatUtcDate = (timestamp: number) => {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date(Number(timestamp) * 1000));
};
