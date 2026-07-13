import { SITE_CONFIG } from "@/constants";

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
            <td>
              ${content}
            </td>
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

function styleObjectToString(styles: Record<string, string | number>) {
  return Object.entries(styles)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${cssKey}:${value}`;
    })
    .join(";");
}

type NotificationEmailData = {
  name: string;
  email: string;
  phone?: string | null;
  propertyType?: string | null;
  propertyTitle?: string | null;
  propertySlug?: string | null;
  propertyPrice?: string | null;
  propertyLocation?: string | null;
  propertyStatus?: string | null;
  propertyUrl?: string;
  source: string;
  message: string;
  createdAt: Date;
};

export function renderNotificationEmail(data: NotificationEmailData) {
  const {
    name,
    email,
    phone,
    propertyType,
    propertyTitle,
    propertyPrice,
    propertyLocation,
    propertyStatus,
    propertyUrl,
    source,
    message,
    createdAt,
  } = data;

  const formattedDate = new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(createdAt);

  const isPropertyInquiry = Boolean(propertyTitle);

  const contactDetails = [
    { label: "Email", value: `<a href="mailto:${email}" style="color:${COLORS.ink}; text-decoration:underline;">${email}</a>` },
    { label: "Phone", value: phone || "—" },
    { label: "Submitted at", value: formattedDate },
    { label: "Source", value: source },
  ];

  const contactDetailsHtml = contactDetails
    .map(
      (detail) => `
      <tr>
        <td style="padding:8px 0; width:120px; font-size:13px; color:${COLORS.fog}; vertical-align:top;">${detail.label}</td>
        <td style="padding:8px 0; font-size:13px; color:${COLORS.ink}; vertical-align:top;">${detail.value}</td>
      </tr>
    `,
    )
    .join("");

  const propertyButton = propertyUrl
    ? `<p style="margin:0;">
        <a href="${propertyUrl}" target="_blank" style="${styleObjectToString(buttonStyles)}">View full listing</a>
      </p>`
    : "";

  const propertyCard = isPropertyInquiry
    ? `
<div style="background-color:${COLORS.cloud}; border:1px solid ${COLORS.wire}; border-radius:12px; padding:20px; margin:0 0 24px;">
  <p style="margin:0 0 12px; font-size:11px; font-weight:500; color:${COLORS.fog}; text-transform:uppercase; letter-spacing:0.08em;">
    Inquired property
  </p>
  <h2 style="margin:0 0 12px; font-family:Georgia, 'Times New Roman', serif; font-size:18px; font-weight:500; color:${COLORS.ink}; line-height:1.3;">
    ${escapeHtml(propertyTitle!)}
  </h2>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;">
    ${propertyPrice ? `<tr><td style="padding:4px 0; width:90px; font-size:13px; color:${COLORS.fog};">Price</td><td style="padding:4px 0; font-size:13px; font-weight:500; color:${COLORS.ink};">${escapeHtml(propertyPrice)}</td></tr>` : ""}
    ${propertyLocation ? `<tr><td style="padding:4px 0; width:90px; font-size:13px; color:${COLORS.fog};">Location</td><td style="padding:4px 0; font-size:13px; color:${COLORS.ink};">${escapeHtml(propertyLocation)}</td></tr>` : ""}
    ${propertyStatus ? `<tr><td style="padding:4px 0; width:90px; font-size:13px; color:${COLORS.fog};">Status</td><td style="padding:4px 0; font-size:13px; color:${COLORS.ink};">${escapeHtml(propertyStatus)}</td></tr>` : ""}
    ${propertyType ? `<tr><td style="padding:4px 0; width:90px; font-size:13px; color:${COLORS.fog};">Type</td><td style="padding:4px 0; font-size:13px; color:${COLORS.ink};">${escapeHtml(propertyType)}</td></tr>` : ""}
  </table>
  ${propertyButton}
</div>
    `
    : "";

  const content = `
<div style="${styleObjectToString(cardStyles)}">
  <p style="margin:0 0 8px; font-size:12px; font-weight:500; color:${COLORS.fog}; text-transform:uppercase; letter-spacing:0.08em;">
    ${isPropertyInquiry ? "Property Lead" : "New Lead"}
  </p>
  <h1 style="margin:0 0 16px; font-family:Georgia, 'Times New Roman', serif; font-size:22px; font-weight:500; color:${COLORS.ink};">
    ${name} sent an inquiry
  </h1>

  ${propertyCard}

  <h2 style="margin:24px 0 8px; font-size:14px; font-weight:500; color:${COLORS.ink};">Message</h2>
  <p style="margin:0 0 24px; padding:16px; background-color:${COLORS.cloud}; border-radius:12px; font-size:14px; color:${COLORS.ink}; white-space:pre-line;">
    ${escapeHtml(message)}
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${COLORS.wire}; margin:16px 0 0;">
    ${contactDetailsHtml}
  </table>

  <p style="margin:24px 0 0; font-size:13px; color:${COLORS.ash};">
    Reply to this email to respond directly to ${name}.
  </p>
</div>
  `.trim();

  return emailWrapper(content);
}

export function renderConfirmationEmail({ name }: { name: string }) {
  const content = `
<div style="${styleObjectToString(cardStyles)}; text-align:center;">
  <div style="width:56px; height:56px; margin:0 auto 16px; background-color:${COLORS.cloud}; border:1px solid ${COLORS.wire}; border-radius:50%; display:block; line-height:56px; text-align:center;">
    <span style="font-size:24px; color:${COLORS.ink};">✓</span>
  </div>
  <h1 style="margin:0 0 12px; font-family:Georgia, 'Times New Roman', serif; font-size:22px; font-weight:500; color:${COLORS.ink};">
    Thanks, ${escapeHtml(name.split(" ")[0])}!
  </h1>
  <p style="margin:0 0 24px; font-size:15px; color:${COLORS.ash}; line-height:1.6;">
    Your inquiry has been received. Amelia Lawsin will review it and get back to you within 24 hours, usually sooner via Messenger or email.
  </p>

  <div style="background-color:${COLORS.cloud}; border:1px solid ${COLORS.wire}; border-radius:12px; padding:20px; text-align:left;">
    <p style="margin:0 0 8px; font-size:13px; font-weight:500; color:${COLORS.ink};">Prefer a faster reply?</p>
    <p style="margin:0 0 12px; font-size:13px; color:${COLORS.fog};">
      Reach Amelia directly through your favorite channel:
    </p>
    <p style="margin:0; font-size:13px; line-height:1.8; color:${COLORS.ink};">
      <strong>Messenger:</strong> <a href="${SITE_CONFIG.messengerUrl}" style="color:${COLORS.ink}; text-decoration:underline;">m.me/amelialawsin</a><br />
      <strong>SMS / Viber:</strong> ${SITE_CONFIG.phone}<br />
      <strong>Email:</strong> <a href="mailto:${SITE_CONFIG.email}" style="color:${COLORS.ink}; text-decoration:underline;">${SITE_CONFIG.email}</a>
    </p>
  </div>
</div>
  `.trim();

  return emailWrapper(content);
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
