export function getDaysRemaining(deadlineMs: number) {
  const deadline = deadlineMs;
  const now = Date.now();

  const diff = deadline - now;

  // If deadline already passed:
  if (diff <= 0) return 0;

  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  return Math.ceil(diff / MS_PER_DAY);
}

export function getDate(value: number) {
  const date = new Date(value);
  return date.toLocaleDateString("en-US");

}

export function getDateTime(input: number | string | Date): string {
  const d = typeof input === "number" || typeof input === "string" ? new Date(input) : input;
  if (isNaN(d.getTime())) return "";
  // Format: "23 Nov 2025, 14:05:09 GMT+7" (locale-aware)
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(d);
}