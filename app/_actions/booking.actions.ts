"use server";

import { Prisma } from "@/app/generated/prisma/client";
import { Resend } from "resend";
import { BookingSchema } from "@/app/_schemas/booking.schema";
import {
  BOOKING_SLOT_HOURS,
  buildScheduledAt,
  getDateRangeBounds,
  getDayBoundsInUtc,
  getManilaParts,
  isSundayInManila,
  isValidBookingSlot,
} from "@/lib/booking-slots";
import { renderBookingNotificationEmail } from "@/lib/emails/booking-emails";
import {
  BOOKING_SUCCESS_MESSAGE,
  enforceWriteRateLimit,
  normalizeEmail,
  WRITE_RATE_LIMIT_MESSAGE,
} from "@/lib/form-abuse";
import { prisma } from "@/lib/prisma";
import { resolvePublishedListing } from "@/lib/published-listing";
import { SITE_CONFIG } from "@/constants";

export type BookingState =
  | { success: true; message: string }
  | {
      success: false;
      errors: Record<string, string[]>;
      message?: string;
      showContactLinks?: boolean;
    }
  | null;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

export async function getBookedTimeSlots(date: string): Promise<number[]> {
  const { minDate, maxDate } = getDateRangeBounds();

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    isSundayInManila(date) ||
    date < minDate ||
    date > maxDate
  ) {
    return BOOKING_SLOT_HOURS.slice();
  }

  const { start, end } = getDayBoundsInUtc(date);

  const bookings = await prisma.booking.findMany({
    where: {
      scheduledAt: { gte: start, lte: end },
      status: "CONFIRMED",
    },
    select: { scheduledAt: true },
  });

  return bookings.map((booking) => getManilaParts(booking.scheduledAt).hour);
}

export async function submitBooking(
  _prevState: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const entries = Object.fromEntries(formData.entries());

  const payload = {
    ...entries,
    phone: entries.phone || undefined,
    propertyTitle: entries.propertyTitle || undefined,
    propertySlug: entries.propertySlug || undefined,
    propertyLocation: entries.propertyLocation || undefined,
    notes: entries.notes || undefined,
    website_url: entries.website_url || undefined,
  };

  const result = BookingSchema.safeParse(payload);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const {
    name,
    email,
    phone,
    date,
    timeSlot,
    notes,
    source,
    website_url,
  } = result.data;

  if (website_url && website_url.length > 0) {
    return {
      success: true,
      message: BOOKING_SUCCESS_MESSAGE,
    };
  }

  const rateLimit = await enforceWriteRateLimit("booking", email);
  if (!rateLimit.ok) {
    return {
      success: false,
      errors: {},
      message: WRITE_RATE_LIMIT_MESSAGE,
      showContactLinks: true,
    };
  }

  if (isSundayInManila(date)) {
    return {
      success: false,
      message: "Viewings are not available on Sundays. Please choose another day.",
      errors: { date: ["Viewings are not available on Sundays."] },
    };
  }

  const scheduledAt = buildScheduledAt(date, timeSlot);

  if (!isValidBookingSlot(scheduledAt)) {
    return {
      success: false,
      message: "That time slot is no longer available. Please choose another.",
      errors: { timeSlot: ["That time slot is no longer available."] },
    };
  }

  const listing = await resolvePublishedListing(result.data.propertySlug);
  const storedTitle = listing?.propertyTitle ?? null;
  const storedSlug = listing?.propertySlug ?? null;
  const storedLocation = listing?.propertyLocation ?? null;

  const confirmed = await prisma.booking.findFirst({
    where: { scheduledAt, status: "CONFIRMED" },
    select: { id: true },
  });

  if (confirmed) {
    return {
      success: false,
      message: "That time slot was just booked. Please choose another.",
      errors: { timeSlot: ["That time slot was just booked."] },
    };
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        name,
        email: normalizeEmail(email),
        phone: phone || null,
        scheduledAt,
        propertyTitle: storedTitle,
        propertySlug: storedSlug,
        propertyLocation: storedLocation,
        notes: notes || null,
        source,
      },
    });

    if (resend && FROM_EMAIL) {
      try {
        await resend.emails.send({
          from: `Amelia Lawsin <${FROM_EMAIL}>`,
          to: SITE_CONFIG.email,
          replyTo: email,
          subject: storedTitle
            ? `Viewing request: ${storedTitle}`
            : "New viewing request from your website",
          html: renderBookingNotificationEmail({
            name,
            email,
            phone,
            scheduledAt: booking.scheduledAt,
            propertyTitle: storedTitle,
            propertyLocation: storedLocation,
            propertyUrl: listing?.propertyUrl,
            notes,
            source,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send booking emails:", emailError);
      }
    }

    return {
      success: true,
      message: BOOKING_SUCCESS_MESSAGE,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "That time slot was just booked. Please choose another.",
        errors: { timeSlot: ["That time slot was just booked."] },
      };
    }

    console.error("Failed to submit booking:", error);
    return {
      success: false,
      message:
        "Something went wrong while scheduling your viewing. Please try again or contact Amelia directly.",
      errors: {},
      showContactLinks: true,
    };
  }
}
