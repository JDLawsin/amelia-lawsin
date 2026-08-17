import Link from "next/link";
import { ctaPrimaryDark, ctaSecondaryDark } from "@/components/ui/cta";
import {
  buildMessengerUrl,
  buildSmsUrl,
  CONTACT_LABELS,
  MOBILE_ONLY_CLASS,
  phoneTelHref,
} from "@/lib/contact-channels";
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/whatsapp-url";

const whatsappUrl = buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE);

const FinalCTASection = () => (
  <section className="bg-ink">
    <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-5">
      <h2 className="text-3xl md:text-4xl font-serif font-medium text-white tracking-tight leading-tight">
        Ready to find your dream property?
      </h2>

      <p className="text-sm text-white/50 leading-relaxed max-w-md">
        Let Amelia guide you through every step, from browsing to turnover.
        Reach out now — it&apos;s free and no commitment required.
      </p>

      <div className="flex flex-wrap justify-center gap-3 mt-2">
        <a
          href={buildMessengerUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={ctaPrimaryDark}
        >
          {CONTACT_LABELS.messenger}
        </a>

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={ctaSecondaryDark}
          >
            {CONTACT_LABELS.whatsapp}
          </a>
        )}

        <a href={phoneTelHref} className={`${ctaSecondaryDark} ${MOBILE_ONLY_CLASS}`}>
          {CONTACT_LABELS.call}
        </a>

        <a
          href={buildSmsUrl()}
          className={`${ctaSecondaryDark} ${MOBILE_ONLY_CLASS}`}
        >
          {CONTACT_LABELS.sms}
        </a>

        <Link href="/properties" className={ctaSecondaryDark}>
          Browse properties
        </Link>
      </div>
    </div>
  </section>
);

export default FinalCTASection;
