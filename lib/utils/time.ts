/**
 * Formats a Date to HH:MM:SS string
 */
export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Formats a Date to YYYY-MM-DD string
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats a Date to DD/MM string using UTC to avoid timezone offset issues
 */
export function formatShortDate(date: Date | null): string | null {
  if (!date) return null;
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  return `${day}/${month}`;
}

/**
 * Checks if a time is within a time range
 */
export function isTimeInRange(
  currentTime: string,
  startTime: string,
  endTime: string
): boolean {
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime <= endTime;
  }

  return currentTime >= startTime && currentTime <= endTime;
}

/**
 * Checks if a date is within a date range (inclusive)
 */
export function isDateInRange(
  currentDate: string,
  startDate: string | null,
  endDate: string | null
): boolean {
  if (!startDate && !endDate) {
    return true;
  }

  if (startDate && !endDate) {
    return currentDate >= startDate;
  }

  if (!startDate && endDate) {
    return currentDate <= endDate;
  }

  return currentDate >= startDate! && currentDate <= endDate!;
}

/**
 * Parses a Date object or ISO string to YYYY-MM-DD format
 */
export function parseDateToString(date: Date | string | null): string | null {
  if (!date) return null;

  if (typeof date === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return null;
    return formatDate(parsed);
  }

  return formatDate(date);
}

/**
 * Converts a date string (YYYY-MM-DD) to a Date object
 * - Returns undefined if the field wasn't provided (to avoid overwriting in updates)
 * - Returns null if the field is explicitly empty
 * - Returns Date if valid date string
 */
export function parseDate(
  dateString: string | undefined | null
): Date | null | undefined {
  if (dateString === undefined) return undefined;
  if (dateString === null || dateString === "") return null;
  const date = new Date(dateString + "T00:00:00.000Z");
  return isNaN(date.getTime()) ? null : date;
}
