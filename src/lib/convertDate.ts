export function getDaysRemaining(deadlineMs: bigint) {
  const deadline = Number(deadlineMs);
  const now = Date.now();

  const diff = deadline - now;

  // If deadline already passed:
  if (diff <= 0) return 0;

  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  return Math.ceil(diff / MS_PER_DAY);
}