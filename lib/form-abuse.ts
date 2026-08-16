import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export type WriteKind = "inquiry" | "booking";

export type WriteRateLimitResult = { ok: true } | { ok: false };

const IP_WINDOW_MS = 15 * 60 * 1000;
const IP_MAX = 30;
const EMAIL_SHORT_MS = 10 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const INQUIRY_EMAIL_SHORT = 5;
const INQUIRY_EMAIL_DAY = 100;
const BOOKING_EMAIL_SHORT = 3;
const BOOKING_EMAIL_DAY = 10;

export const FORM_SUCCESS_FOLLOW_UP =
  "Amelia will reply by email, WhatsApp, or Messenger within 24 hours.";

export const INQUIRY_SUCCESS_MESSAGE = `Thank you. ${FORM_SUCCESS_FOLLOW_UP}`;

export const BOOKING_SUCCESS_MESSAGE = `Your viewing request has been received. Amelia will confirm your slot shortly. ${FORM_SUCCESS_FOLLOW_UP}`;

export const INQUIRY_ALREADY_ON_FILE_MESSAGE =
  "We already have this inquiry. To add a question, message Amelia on WhatsApp or Messenger.";

export const WRITE_RATE_LIMIT_MESSAGE =
  "Too many requests right now. Please try again later, or reach Amelia directly:";

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const getClientIp = (headerList: Headers): string => {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = headerList.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
};

export async function enforceWriteRateLimit(
  kind: WriteKind,
  email: string,
): Promise<WriteRateLimitResult> {
  const headerList = await headers();
  const ip = getClientIp(headerList);
  const now = Date.now();
  const normalized = normalizeEmail(email);

  await prisma.formWriteEvent.create({ data: { ip } });

  const ipCount = await prisma.formWriteEvent.count({
    where: {
      ip,
      createdAt: { gte: new Date(now - IP_WINDOW_MS) },
    },
  });

  if (ipCount > IP_MAX) {
    return { ok: false };
  }

  if (kind === "inquiry") {
    const [shortCount, dayCount] = await Promise.all([
      prisma.inquiry.count({
        where: {
          email: { equals: normalized, mode: "insensitive" },
          createdAt: { gte: new Date(now - EMAIL_SHORT_MS) },
        },
      }),
      prisma.inquiry.count({
        where: {
          email: { equals: normalized, mode: "insensitive" },
          createdAt: { gte: new Date(now - DAY_MS) },
        },
      }),
    ]);

    if (shortCount >= INQUIRY_EMAIL_SHORT || dayCount >= INQUIRY_EMAIL_DAY) {
      return { ok: false };
    }
  } else {
    const [shortCount, dayCount] = await Promise.all([
      prisma.booking.count({
        where: {
          email: { equals: normalized, mode: "insensitive" },
          createdAt: { gte: new Date(now - EMAIL_SHORT_MS) },
        },
      }),
      prisma.booking.count({
        where: {
          email: { equals: normalized, mode: "insensitive" },
          createdAt: { gte: new Date(now - DAY_MS) },
        },
      }),
    ]);

    if (shortCount >= BOOKING_EMAIL_SHORT || dayCount >= BOOKING_EMAIL_DAY) {
      return { ok: false };
    }
  }

  return { ok: true };
}

export async function hasRecentListingInquiry(
  email: string,
  propertySlug: string,
): Promise<boolean> {
  const existing = await prisma.inquiry.findFirst({
    where: {
      email: { equals: normalizeEmail(email), mode: "insensitive" },
      propertySlug,
      createdAt: { gte: new Date(Date.now() - DAY_MS) },
    },
    select: { id: true },
  });

  return Boolean(existing);
}
