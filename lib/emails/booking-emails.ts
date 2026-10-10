import { SITE_CONFIG } from "@/constants";
import { formatBookingDateTime } from "@/lib/booking-slots";

const COLORS = {
  ink: "#1d1d1f",
  ash: "#6e6e73",
  fog: "#74747a",
  wire: "#d2d2d7",
  cloud: "#f5f5f7",
  white: "#ffffff",
};

const cardStyles = {
  backgroundColor: COLORS.white,
  borderRadius: "16px",
  border: `1px solid ${COLORS.wire}`,
  padding: "32px",
};

const buttonStyles = {
  display: "inline-block",
  backgroundColor: COLORS.ink,
  color: COLORS.white,
  textDecoration: "none",
  padding: "12px 24px",
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: "500",
};

const footerTextStyles = {
  fontSize: "12px",
  color: COLORS.fog,
  textAlign: "center" as const,
  marginTop: "24px",
};

function styleObjectToString(styles: Record<string, string | number>) {
  return Object.entries(styles)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${cssKey}:${value}`;
    })
    .join(";");
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function emailWrapper(content: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Amelia Lawsin — Real Estate</title>
</head>
<body style="margin:0; padding:0; background-color:${COLORS.cloud}; -webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.cloud};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
          <tr>
            <td style="padding-bottom:24px; text-align:center;">
              <p style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:20px; font-weight:500; color:${COLORS.ink};">
                Amelia Lawsin
              </p>
              <p style="margin:4px 0 0; font-size:12px; color:${COLORS.fog};">
                Licensed Real Estate Agent · Cebu, Philippines
              </p>
            </td>
          </tr>
          <tr>
            <td>${content}</td>
          </tr>
          <tr>
            <td style="padding-top:24px;">
              <p style="${styleObjectToString(footerTextStyles)}">
                This email was sent from ${SITE_CONFIG.name}'s website.
                <br />
                ${SITE_CONFIG.email} · ${SITE_CONFIG.phone}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

type BookingEmailData = {
  name: string;
  email: string;
  phone?: string | null;
  scheduledAt: Date;
  propertyTitle?: string | null;
  propertyLocation?: string | null;
  propertyUrl?: string;
  notes?: string | null;
  source: string;
};

export function renderBookingNotificationEmail(data: BookingEmailData) {
  const {
    name,
    email,
    phone,
    scheduledAt,
    propertyTitle,
    propertyLocation,
    propertyUrl,
    notes,
    source,
  } = data;

  const propertyCard = propertyTitle
    ? `
<div style="background-color:${COLORS.cloud}; border:1px solid ${COLORS.wire}; border-radius:12px; padding:20px; margin:0 0 24px;">
  <p style="margin:0 0 12px; font-size:11px; font-weight:500; color:${COLORS.fog}; text-transform:uppercase; letter-spacing:0.08em;">
    Property
  </p>
  <h2 style="margin:0 0 12px; font-family:Georgia, 'Times New Roman', serif; font-size:18px; font-weight:500; color:${COLORS.ink}; line-height:1.3;">
    ${escapeHtml(propertyTitle)}
  </h2>
  ${propertyLocation ? `<p style="margin:0 0 12px; font-size:13px; color:${COLORS.ash};">${escapeHtml(propertyLocation)}</p>` : ""}
  ${
    propertyUrl
      ? `<p style="margin:0;"><a href="${escapeHtml(propertyUrl)}" target="_blank" style="${styleObjectToString(buttonStyles)}">View listing</a></p>`
      : ""
  }
</div>
    `
    : "";

  const content = `
<div style="${styleObjectToString(cardStyles)}">
  <p style="margin:0 0 8px; font-size:12px; font-weight:500; color:${COLORS.fog}; text-transform:uppercase; letter-spacing:0.08em;">
    Viewing Request
  </p>
  <h1 style="margin:0 0 16px; font-family:Georgia, 'Times New Roman', serif; font-size:22px; font-weight:500; color:${COLORS.ink};">
    ${escapeHtml(name)} scheduled a viewing
  </h1>

  <div style="background-color:${COLORS.cloud}; border:1px solid ${COLORS.wire}; border-radius:12px; padding:20px; margin:0 0 24px;">
    <p style="margin:0 0 8px; font-size:11px; font-weight:500; color:${COLORS.fog}; text-transform:uppercase; letter-spacing:0.08em;">
      Preferred date & time
    </p>
    <p style="margin:0; font-size:15px; font-weight:500; color:${COLORS.ink};">
      ${escapeHtml(formatBookingDateTime(scheduledAt))}
    </p>
  </div>

  ${propertyCard}

  ${
    notes
      ? `<h2 style="margin:0 0 8px; font-size:14px; font-weight:500; color:${COLORS.ink};">Notes</h2>
  <p style="margin:0 0 24px; padding:16px; background-color:${COLORS.cloud}; border-radius:12px; font-size:14px; color:${COLORS.ink}; white-space:pre-line;">
    ${escapeHtml(notes)}
  </p>`
      : ""
  }

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${COLORS.wire}; margin:16px 0 0;">
    <tr>
      <td style="padding:8px 0; width:120px; font-size:13px; color:${COLORS.fog}; vertical-align:top;">Email</td>
      <td style="padding:8px 0; font-size:13px; color:${COLORS.ink}; vertical-align:top;"><a href="mailto:${email}" style="color:${COLORS.ink}; text-decoration:underline;">${escapeHtml(email)}</a></td>
    </tr>
    <tr>
      <td style="padding:8px 0; width:120px; font-size:13px; color:${COLORS.fog}; vertical-align:top;">Phone</td>
      <td style="padding:8px 0; font-size:13px; color:${COLORS.ink}; vertical-align:top;">${phone ? escapeHtml(phone) : "—"}</td>
    </tr>
    <tr>
      <td style="padding:8px 0; width:120px; font-size:13px; color:${COLORS.fog}; vertical-align:top;">Source</td>
      <td style="padding:8px 0; font-size:13px; color:${COLORS.ink}; vertical-align:top;">${escapeHtml(source)}</td>
    </tr>
  </table>

  <p style="margin:24px 0 0; font-size:13px; color:${COLORS.ash};">
    Reply to this email to confirm the viewing with ${escapeHtml(name)}.
  </p>
</div>
  `.trim();

  return emailWrapper(content);
}

export function renderBookingConfirmationEmail({
  name,
  scheduledAt,
}: {
  name: string;
  scheduledAt: Date;
}) {
  const content = `
<div style="${styleObjectToString(cardStyles)}; text-align:center;">
  <div style="width:56px; height:56px; margin:0 auto 16px; background-color:${COLORS.cloud}; border:1px solid ${COLORS.wire}; border-radius:50%; display:block; line-height:56px; text-align:center;">
    <span style="font-size:24px; color:${COLORS.ink};">✓</span>
  </div>
  <h1 style="margin:0 0 12px; font-family:Georgia, 'Times New Roman', serif; font-size:22px; font-weight:500; color:${COLORS.ink};">
    Viewing request received
  </h1>
  <p style="margin:0 0 16px; font-size:15px; color:${COLORS.ash}; line-height:1.6;">
    Thanks, ${escapeHtml(name.split(" ")[0])}! Amelia will confirm your preferred slot shortly.
  </p>
  <div style="background-color:${COLORS.cloud}; border:1px solid ${COLORS.wire}; border-radius:12px; padding:20px; text-align:left;">
    <p style="margin:0 0 8px; font-size:11px; font-weight:500; color:${COLORS.fog}; text-transform:uppercase; letter-spacing:0.08em;">
      Requested time
    </p>
    <p style="margin:0; font-size:14px; color:${COLORS.ink};">
      ${escapeHtml(formatBookingDateTime(scheduledAt))}
    </p>
  </div>
</div>
  `.trim();

  return emailWrapper(content);
}
