import { formatDistanceToNow, parseISO } from "date-fns";

/**
 * Formats a date string (ISO or relative time string) to a relative time format
 * @param dateString - ISO date string or relative time string (e.g., "2 hours ago")
 * @returns Formatted relative time string (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
  // If already in relative format (contains "ago"), return as is
  if (dateString.includes("ago")) {
    return dateString;
  }

  try {
    // Try to parse as ISO string
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    // If parsing fails, return original string
    return dateString;
  }
}

