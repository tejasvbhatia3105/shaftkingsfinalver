export function calculateCountdown(
  targetHour: number,
  targetMinute: number,
  targetDay: number,
  targetMonth: number,
  targetYear: number
) {
  const targetDate: Date = new Date(
    Date.UTC(
      targetYear,
      targetMonth - 1,
      targetDay,
      targetHour,
      targetMinute,
      0
    )
  );
  const now: Date = new Date();
  const nowUTC: Date = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    )
  );
  const differenceInMilliseconds: number =
    targetDate.getTime() - nowUTC.getTime();

  if (differenceInMilliseconds <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const days: number = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );
  if (days > 0) {
    return { days, hours: 0, minutes: 0, seconds: 0 };
  }
  const hours: number = Math.floor(
    (differenceInMilliseconds / (1000 * 60 * 60)) % 24
  );
  const minutes: number = Math.floor(
    (differenceInMilliseconds / (1000 * 60)) % 60
  );
  const seconds: number = Math.floor((differenceInMilliseconds / 1000) % 60);
  return { days, hours, minutes, seconds };
}
