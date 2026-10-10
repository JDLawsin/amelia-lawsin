"use server";

import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { InquirySchema } from "@/app/_schemas/inquiry.schema";
import { renderNotificationEmail } from "@/lib/emails/inquiry-emails";
import {
  enforceWriteRateLimit,
  hasRecentListingInquiry,
  INQUIRY_ALREADY_ON_FILE_MESSAGE,
  INQUIRY_SUCCESS_MESSAGE,
  normalizeEmail,
  WRITE_RATE_LIMIT_MESSAGE,
} from "@/lib/form-abuse";
import { resolvePublishedListing } from "@/lib/published-listing";
import { SITE_CONFIG } from "@/constants";

export type InquiryState =
  | { success: true; message: string; alreadyOnFile?: boolean }
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

export async function submitInquiry(
  _prevState: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const entries = Object.fromEntries(formData.entries());

  const payload = {
    ...entries,
    phone: entries.phone || undefined,
    propertyType: entries.propertyType || undefined,
    propertyTitle: entries.propertyTitle || undefined,
    propertySlug: entries.propertySlug || undefined,
    propertyPrice: entries.propertyPrice || undefined,
    propertyLocation: entries.propertyLocation || undefined,
    propertyStatus: entries.propertyStatus || undefined,
    website_url: entries.website_url || undefined,
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
    source,
    message,
    website_url,
  } = result.data;

  if (website_url && website_url.length > 0) {
    return {
      success: true,
      message: INQUIRY_SUCCESS_MESSAGE,
    };
  }

  const rateLimit = await enforceWriteRateLimit("inquiry", email);
  if (!rateLimit.ok) {
    return {
      success: false,
      errors: {},
      message: WRITE_RATE_LIMIT_MESSAGE,
      showContactLinks: true,
    };
  }

  const slugProvided = Boolean(result.data.propertySlug?.trim());
  const listing = await resolvePublishedListing(result.data.propertySlug);

  if (listing && (await hasRecentListingInquiry(email, listing.propertySlug))) {
    return {
      success: true,
      alreadyOnFile: true,
      message: INQUIRY_ALREADY_ON_FILE_MESSAGE,
    };
  }

  const storedType =
    listing?.propertyType ?? (slugProvided ? null : propertyType || null);
  const storedTitle = listing?.propertyTitle ?? null;
  const storedSlug = listing?.propertySlug ?? null;
  const storedPrice = listing?.propertyPrice ?? null;
  const storedLocation = listing?.propertyLocation ?? null;
  const storedStatus = listing?.propertyStatus ?? null;

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email: normalizeEmail(email),
        phone: phone || null,
        propertyType: storedType,
        propertyTitle: storedTitle,
        propertySlug: storedSlug,
        propertyPrice: storedPrice,
        propertyLocation: storedLocation,
        propertyStatus: storedStatus,
        source,
        message,
      },
    });

    if (resend && FROM_EMAIL) {
      try {
        await resend.emails.send({
          from: `Amelia Lawsin <${FROM_EMAIL}>`,
          to: SITE_CONFIG.email,
          replyTo: email,
          subject: storedTitle
            ? `New inquiry: ${storedTitle}`
            : "New inquiry from your website",
          html: renderNotificationEmail({
            name,
            email,
            phone,
            propertyType: storedType,
            propertyTitle: storedTitle,
            propertySlug: storedSlug,
            propertyPrice: storedPrice,
            propertyLocation: storedLocation,
            propertyStatus: storedStatus,
            propertyUrl: listing?.propertyUrl,
            source,
            message,
            createdAt: inquiry.createdAt,
          }),
        });
      } catch (emailError) {
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
      message: INQUIRY_SUCCESS_MESSAGE,
    };
  } catch (error) {
    console.error("Failed to submit inquiry:", error);
    return {
      success: false,
      message:
        "Something went wrong while sending your inquiry. Please try again or contact Amelia directly.",
      errors: {},
      showContactLinks: true,
    };
  }
}
