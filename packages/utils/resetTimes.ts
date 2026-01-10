export function getNextResetTimes() {
  const now = new Date();

  const nextDailyResetUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  nextDailyResetUTC.setUTCDate(nextDailyResetUTC.getUTCDate() + 1);
  nextDailyResetUTC.setUTCHours(0, 0, 0, 0);

  const nextWeeklyResetUTC = new Date(now);
  const dayOfWeek = now.getUTCDay();
  const daysUntilMonday = (1 - dayOfWeek + 7) % 7 || 7;

  nextWeeklyResetUTC.setUTCDate(now.getUTCDate() + daysUntilMonday);
  nextWeeklyResetUTC.setUTCHours(0, 0, 0, 0);

  return {
    nextDailyReset: Math.floor(nextDailyResetUTC.getTime() / 1000),
    nextWeeklyReset: Math.floor(nextWeeklyResetUTC.getTime() / 1000),
  };
}
