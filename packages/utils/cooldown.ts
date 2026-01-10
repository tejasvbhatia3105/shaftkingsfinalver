export const COOLDOWN_PERIOD = 60 * 1000;

export function getRemainingCooldown(lastUpdateTimestamp: number) {
  const now = Date.now();
  const elapsed = now - lastUpdateTimestamp;
  return Math.max(0, COOLDOWN_PERIOD - elapsed);
}
