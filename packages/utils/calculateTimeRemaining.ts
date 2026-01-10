export function calculateTimeRemaining(targetDate: string) {
  const targetTime = new Date(targetDate).getTime();
  const currentTime = new Date().getTime();
  const timeDifference = targetTime - currentTime;

  if (timeDifference <= 0) {
    return { hours: '00', minutes: '00', seconds: '00' };
  }

  const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((timeDifference / 1000 / 60) % 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor((timeDifference / 1000) % 60)
    .toString()
    .padStart(2, '0');

  return { hours, minutes, seconds };
}
