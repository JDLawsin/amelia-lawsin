import { z } from "zod";
import { BOOKING_SLOT_HOURS } from "@/lib/booking-slots";

export const BookingSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z
    .string()
    .max(50, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Select a valid date"),
  timeSlot: z.coerce
    .number()
    .int()
    .refine(
      (hour) => (BOOKING_SLOT_HOURS as readonly number[]).includes(hour),
      "Select a valid time slot",
    ),
  propertyTitle: z
    .string()
    .max(200)
    .optional()
    .or(z.literal("")),
  propertySlug: z
    .string()
    .max(200)
    .optional()
    .or(z.literal("")),
  propertyLocation: z
    .string()
    .max(200)
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  source: z.enum(["Contact page", "Property listing"]),
  honeypot: z.string().optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof BookingSchema>;
