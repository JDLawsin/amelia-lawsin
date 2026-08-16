"use server";

import { Prisma } from "@/app/generated/prisma/client";
import { Resend } from "resend";
import { BookingSchema } from "@/app/_schemas/booking.schema";
import {
  BOOKING_SLOT_HOURS,
  buildScheduledAt,
  getDayBoundsInUtc,
  getManilaParts,
  isSundayInManila,
  isValidBookingSlot,
} from "@/lib/booking-slots";
import {
  renderBookingConfirmationEmail,
  renderBookingNotificationEmail,
} from "@/lib/emails/booking-emails";
import { prisma } from "@/lib/prisma";
import { SITE_CONFIG } from "@/constants";

export type BookingState =
  | { success: true; message: string }
  | { success: false; errors: Record<string, string[]>; message?: string }
  | null;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

export async function getBookedTimeSlots(date: string): Promise<number[]> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isSundayInManila(date)) {
    return BOOKING_SLOT_HOURS.slice();
  }

  const { start, end } = getDayBoundsInUtc(date);

  const bookings = await prisma.booking.findMany({
    where: {
      scheduledAt: { gte: start, lte: end },
      status: { in: ["PENDING", "CONFIRMED"] },
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
    honeypot: entries.honeypot || undefined,
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
    propertyTitle,
    propertySlug,
    propertyLocation,
    notes,
    source,
    honeypot,
  } = result.data;

  if (honeypot && honeypot.length > 0) {
    return {
      success: true,
      message:
        "Your viewing request has been received. Amelia will confirm your slot shortly.",
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

  try {
    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone: phone || null,
        scheduledAt,
        propertyTitle: propertyTitle || null,
        propertySlug: propertySlug || null,
        propertyLocation: propertyLocation || null,
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
          subject: propertyTitle
            ? `Viewing request: ${propertyTitle}`
            : "New viewing request from your website",
          html: renderBookingNotificationEmail({
            name,
            email,
            phone,
            scheduledAt: booking.scheduledAt,
            propertyTitle,
            propertySlug,
            propertyLocation,
            notes,
            source,
          }),
        });

        await resend.emails.send({
          from: `Amelia Lawsin <${FROM_EMAIL}>`,
          to: email,
          subject: "Your viewing request has been received",
          html: renderBookingConfirmationEmail({
            name,
            scheduledAt: booking.scheduledAt,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send booking emails:", emailError);
      }
    }

    return {
      success: true,
      message:
        "Your viewing request has been received. Amelia will confirm your slot shortly.",
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
    };
  }
}
