export const BOOKING_TIMEZONE = "Asia/Manila";

export const BOOKING_SLOT_HOURS = [9, 10, 11, 13, 14, 15, 16] as const;

export const BOOKING_MIN_LEAD_MS = 24 * 60 * 60 * 1000;
export const BOOKING_MAX_AHEAD_MS = 30 * 24 * 60 * 60 * 1000;

type ManilaParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
};

const WEEKDAY_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export const getManilaParts = (date: Date): ManilaParts => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  });

  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    weekday: WEEKDAY_MAP[get("weekday")] ?? 0,
  };
};

export const formatDateInput = (date: Date): string => {
  const parts = getManilaParts(date);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
};

export const buildScheduledAt = (date: string, hour: number): Date =>
  new Date(`${date}T${String(hour).padStart(2, "0")}:00:00+08:00`);

export const formatTimeSlotLabel = (hour: number): string => {
  const period = hour >= 12 ? "PM" : "AM";
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:00 ${period}`;
};

export const isValidBookingSlot = (
  scheduledAt: Date,
  now = new Date(),
): boolean => {
  const minTime = new Date(now.getTime() + BOOKING_MIN_LEAD_MS);
  const maxTime = new Date(now.getTime() + BOOKING_MAX_AHEAD_MS);

  if (scheduledAt < minTime || scheduledAt > maxTime) {
    return false;
  }

  const parts = getManilaParts(scheduledAt);

  if (parts.weekday === 0) return false;
  if (!(BOOKING_SLOT_HOURS as readonly number[]).includes(parts.hour)) {
    return false;
  }
  if (parts.minute !== 0) return false;

  return true;
};

export const getDateRangeBounds = (now = new Date()) => {
  const min = new Date(now.getTime() + BOOKING_MIN_LEAD_MS);
  const max = new Date(now.getTime() + BOOKING_MAX_AHEAD_MS);

  return {
    minDate: formatDateInput(min),
    maxDate: formatDateInput(max),
  };
};

export const getDayBoundsInUtc = (date: string) => ({
  start: new Date(`${date}T00:00:00+08:00`),
  end: new Date(`${date}T23:59:59.999+08:00`),
});

export const formatBookingDateTime = (scheduledAt: Date): string =>
  new Intl.DateTimeFormat("en-PH", {
    timeZone: BOOKING_TIMEZONE,
    dateStyle: "full",
    timeStyle: "short",
  }).format(scheduledAt);

export const isSundayInManila = (date: string): boolean => {
  const parts = getManilaParts(buildScheduledAt(date, 9));
  return parts.weekday === 0;
};
