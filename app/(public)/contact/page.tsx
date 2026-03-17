import { SITE_CONFIG } from "@/constants";
import type { Metadata } from "next";
import InquiryForm from "./_components/InquiryForm";
import ContactMap from "./_components/ContactMap";
import FaqAccordion from "./_components/FaqAccordion";

export const metadata: Metadata = {
  title: "Contact Amelia Lawsin — Licensed Real Estate Agent in Cebu",
  description:
    "Get in touch with Amelia Lawsin — free consultation via Messenger, SMS, Viber or email. Licensed real estate agent in Cebu, Philippines. OFW specialist.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Amelia Lawsin — Real Estate Agent Cebu",
    description:
      "Free consultation via Messenger, SMS, Viber or email. Licensed agent in Cebu, Philippines.",
    type: "website",
  },
};

const SectionLabel = ({ children }: { children: string }) => (
  <p className="text-[10px] font-medium text-fog uppercase tracking-[0.15em] mb-5">
    {children}
  </p>
);

const CHANNELS = [
  {
    title: "Messenger",
    description: "Fastest response — usually within hours",
    href: SITE_CONFIG.messengerUrl,
    external: true,
    primary: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.914 1.318 5.52 3.396 7.28V22l3.344-1.838c.896.248 1.845.38 2.26.38 5.523 0 10-4.144 10-9.243S17.523 2 12 2z" />
      </svg>
    ),
    cta: "Message now →",
  },
  {
    title: "SMS / Viber",
    description: SITE_CONFIG.phone,
    href: SITE_CONFIG.smsUrl,
    external: false,
    primary: false,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1d1d1f"
        strokeWidth="1.5"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    cta: "Send SMS →",
  },
  {
    title: "Email",
    description: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
    external: false,
    primary: false,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1d1d1f"
        strokeWidth="1.5"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    cta: "Send email →",
  },
];

const INFO_ITEMS = [
  {
    label: "Location",
    value: SITE_CONFIG.location,
    icon: (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1d1d1f"
        strokeWidth="1.5"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "Phone / Viber",
    value: SITE_CONFIG.phone,
    icon: (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1d1d1f"
        strokeWidth="1.5"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: "Email",
    value: SITE_CONFIG.email,
    icon: (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1d1d1f"
        strokeWidth="1.5"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: "Response time",
    value: "Usually within a few hours via Messenger",
    icon: (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1d1d1f"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

const ContactPage = () => (
  <main className="bg-white">
    <section className="border-b border-wire">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 text-center">
        <p className="text-[10px] font-medium text-fog uppercase tracking-[0.15em] mb-4">
          Get in touch
        </p>
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-ink tracking-tight leading-tight mb-4">
          Let&apos;s find your dream
          <br className="hidden md:block" />
          property together.
        </h1>
        <p className="text-sm text-ash leading-relaxed max-w-md mx-auto">
          Reach out via your preferred channel — Messenger, SMS, Viber, or
          email. Free consultation, no commitment required.
        </p>
      </div>
    </section>

    <section className="bg-cloud border-b border-wire">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-[10px] font-medium text-fog uppercase tracking-[0.15em] mb-6 text-center">
          Quickest ways to reach me
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-wire rounded-2xl overflow-hidden">
          {CHANNELS.map((channel) => (
            <a
              key={channel.title}
              href={channel.href}
              target={channel.external ? "_blank" : undefined}
              rel={channel.external ? "noopener noreferrer" : undefined}
              className={`
                group flex flex-col gap-4 p-6 transition-opacity hover:opacity-90
                ${channel.primary ? "bg-ink" : "bg-white"}
              `}
            >
              <div
                className={`
                w-10 h-10 rounded-xl flex items-center justify-center
                ${channel.primary ? "bg-white/10" : "bg-cloud"}
              `}
              >
                {channel.icon}
              </div>
              <div>
                <p
                  className={`text-sm font-medium mb-1 ${channel.primary ? "text-white" : "text-ink"}`}
                >
                  {channel.title}
                </p>
                <p
                  className={`text-xs mb-4 leading-relaxed ${channel.primary ? "text-white/50" : "text-ash"}`}
                >
                  {channel.description}
                </p>
                <span
                  className={`
                  inline-flex items-center text-xs font-medium px-4 py-2 rounded-full transition-colors
                  ${
                    channel.primary
                      ? "bg-white text-ink hover:bg-white/90"
                      : "bg-cloud text-ink border border-wire hover:bg-wire/50"
                  }
                `}
                >
                  {channel.cta}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>

    <section className="border-b border-wire">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-wire">
        <div className="px-6 lg:px-12 py-12">
          <SectionLabel>Send an inquiry</SectionLabel>
          <h2 className="text-xl font-serif font-medium text-ink mb-2">
            Prefer to write it out?
          </h2>
          <p className="text-sm text-ash leading-relaxed mb-8">
            Fill in the form and Amelia will get back to you within 24 hours.
          </p>
          <InquiryForm />
        </div>

        <div className="px-6 lg:px-12 py-12 flex flex-col gap-8">
          <div>
            <SectionLabel>Office information</SectionLabel>
            <div className="flex flex-col gap-4">
              {INFO_ITEMS.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cloud border border-wire rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-ink mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-xs text-ash leading-relaxed">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ContactMap />

          <div>
            <SectionLabel>Follow on social</SectionLabel>
            <div className="flex gap-2">
              <a
                href={SITE_CONFIG.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-4 flex items-center gap-2 bg-cloud border border-wire rounded-full text-xs text-ink hover:border-ink transition-colors"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#1d1d1f">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                Facebook
              </a>
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-4 flex items-center gap-2 bg-cloud border border-wire rounded-full text-xs text-ink hover:border-ink transition-colors"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1d1d1f"
                  strokeWidth="2"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-cloud border-b border-wire">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <p className="text-[10px] font-medium text-fog uppercase tracking-[0.15em] mb-2 text-center">
          Frequently asked questions
        </p>
        <h2 className="text-2xl font-serif font-medium text-ink text-center mb-10 tracking-tight">
          Common questions answered
        </h2>
        <div className="max-w-2xl mx-auto">
          <FaqAccordion />
        </div>
      </div>
    </section>
  </main>
);

export default ContactPage;
