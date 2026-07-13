"use server";

import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { InquirySchema } from "@/app/_schemas/inquiry.schema";
import {
  renderNotificationEmail,
  renderConfirmationEmail,
} from "@/lib/emails/inquiry-emails";
import { SITE_CONFIG } from "@/constants";

export type InquiryState =
  | { success: true; message: string }
  | { success: false; errors: Record<string, string[]>; message?: string }
  | null;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

export async function submitInquiry(
  _prevState: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const entries = Object.fromEntries(formData.entries());

  // Normalize optional empty strings to undefined for validation.
  const payload = {
    ...entries,
    phone: entries.phone || undefined,
    propertyType: entries.propertyType || undefined,
    propertyTitle: entries.propertyTitle || undefined,
    propertySlug: entries.propertySlug || undefined,
    propertyPrice: entries.propertyPrice || undefined,
    propertyLocation: entries.propertyLocation || undefined,
    propertyStatus: entries.propertyStatus || undefined,
    honeypot: entries.honeypot || undefined,
  };

  const result = InquirySchema.safeParse(payload);

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
    propertyType,
    propertyTitle,
    propertySlug,
    propertyPrice,
    propertyLocation,
    propertyStatus,
    source,
    message,
    honeypot,
  } = result.data;

  // Honeypot: if the hidden field is filled, treat as spam silently.
  if (honeypot && honeypot.length > 0) {
    // Return fake success so bots cannot probe the form.
    return {
      success: true,
      message: "Thank you. Amelia will get back to you shortly.",
    };
  }

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        propertyType: propertyType || null,
        propertyTitle: propertyTitle || null,
        propertySlug: propertySlug || null,
        propertyPrice: propertyPrice || null,
        propertyLocation: propertyLocation || null,
        propertyStatus: propertyStatus || null,
        source,
        message,
      },
    });

    const propertyUrl = propertySlug
      ? `${process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000"}/properties/${propertySlug}`
      : undefined;

    if (resend && FROM_EMAIL) {
      try {
        // Notify Amelia
        await resend.emails.send({
          from: `Amelia Lawsin <${FROM_EMAIL}>`,
          to: SITE_CONFIG.email,
          replyTo: email,
          subject: propertyTitle
            ? `New inquiry: ${propertyTitle}`
            : "New inquiry from your website",
          html: renderNotificationEmail({
            name,
            email,
            phone,
            propertyType,
            propertyTitle,
            propertySlug,
            propertyPrice,
            propertyLocation,
            propertyStatus,
            propertyUrl,
            source,
            message,
            createdAt: inquiry.createdAt,
          }),
        });

        // Auto-reply to the user
        await resend.emails.send({
          from: `Amelia Lawsin <${FROM_EMAIL}>`,
          to: email,
          subject: "We've received your inquiry — Amelia will reply soon",
          html: renderConfirmationEmail({ name }),
        });
      } catch (emailError) {
        // Don't fail the submission if email fails; the inquiry is already saved.
        console.error("Failed to send inquiry emails:", emailError);
      }
    } else {
      if (!resend) {
        console.warn(
          "RESEND_API_KEY is not configured. Inquiry saved but no emails were sent.",
        );
      } else if (!FROM_EMAIL) {
        console.warn(
          "RESEND_FROM_EMAIL is not configured. Inquiry saved but no emails were sent.",
        );
      }
    }

    return {
      success: true,
      message: "Thank you. Amelia will get back to you shortly.",
    };
  } catch (error) {
    console.error("Failed to submit inquiry:", error);
    return {
      success: false,
      message:
        "Something went wrong while sending your inquiry. Please try again or contact Amelia directly.",
      errors: {},
    };
  }
}
