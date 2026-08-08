export type InquiryContactFields = {
  name: string;
  email: string;
  phone: string | null;
  message: string;
  propertyTitle: string | null;
  propertySlug: string | null;
};

export type ContactChannel = "Email" | "WhatsApp" | "Call";

const siteBaseUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000").replace(
    /\/$/,
    "",
  );

const propertyLine = (inquiry: InquiryContactFields): string | null => {
  if (!inquiry.propertyTitle) return null;
  if (inquiry.propertySlug) {
    return `${inquiry.propertyTitle} (${siteBaseUrl()}/properties/${inquiry.propertySlug})`;
  }
  return inquiry.propertyTitle;
};

/** Strip non-digits; convert PH 09… mobiles to 63… for wa.me */
export const normalizePhoneForWhatsApp = (
  phone: string | null | undefined,
): string | null => {
  if (!phone?.trim()) return null;

  let digits = phone.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("0") && digits.length >= 10) {
    digits = `63${digits.slice(1)}`;
  }

  // PH mobile: 639XXXXXXXXX (12 digits) or other intl with reasonable length
  if (digits.length < 10 || digits.length > 15) return null;

  return digits;
};

export const buildInquiryMailto = (inquiry: InquiryContactFields): string => {
  const subject = inquiry.propertyTitle
    ? `Re: inquiry — ${inquiry.propertyTitle}`
    : "Re: your website inquiry";

  const lines = [
    `Hi ${inquiry.name},`,
    "",
    "Thank you for reaching out through my website. I'm following up on your inquiry.",
  ];

  const property = propertyLine(inquiry);
  if (property) {
    lines.push("", `Regarding: ${property}`);
  }

  lines.push(
    "",
    "You wrote:",
    inquiry.message,
    "",
    "Best regards,",
    "Amelia Lawsin",
  );

  const params = new URLSearchParams({
    subject,
    body: lines.join("\n"),
  });

  return `mailto:${inquiry.email}?${params.toString()}`;
};

export const buildInquiryWhatsAppUrl = (
  inquiry: InquiryContactFields,
): string | null => {
  const digits = normalizePhoneForWhatsApp(inquiry.phone);
  if (!digits) return null;

  const parts = [
    `Hi ${inquiry.name}, thank you for your inquiry on my website.`,
  ];

  if (inquiry.propertyTitle) {
    parts.push(`I'm following up about ${inquiry.propertyTitle}.`);
  } else {
    parts.push("I'm following up on your message.");
  }

  const text = parts.join(" ");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

export const buildInquiryTelUrl = (
  phone: string | null | undefined,
): string | null => {
  if (!phone?.trim()) return null;
  return `tel:${phone.trim()}`;
};

export const contactChannelNote = (channel: ContactChannel): string =>
  `Contacted via ${channel}`;
