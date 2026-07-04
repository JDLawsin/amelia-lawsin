import { SITE_CONFIG } from "@/constants";
import Link from "next/link";
import { ctaPrimaryDark, ctaSecondaryDark } from "@/components/ui/cta";

const FinalCTASection = () => (
  <section className="bg-ink">
    <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-5">
      <h2 className="text-3xl md:text-4xl font-serif font-medium text-white tracking-tight leading-tight">
        Ready to find your dream property?
      </h2>

      <p className="text-sm text-white/45 leading-relaxed max-w-md">
        Let Amelia guide you through every step, from browsing to turnover.
        Reach out now — it&apos;s free and no commitment required.
      </p>

      <div className="flex flex-wrap justify-center gap-3 mt-2">
        <a
          href={SITE_CONFIG.messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={ctaPrimaryDark}
        >
          Message on Messenger
        </a>

        <a href={SITE_CONFIG.smsUrl} className={ctaSecondaryDark}>
          Send SMS / Viber
        </a>

        <Link href="/properties" className={ctaSecondaryDark}>
          Browse properties
        </Link>
      </div>
    </div>
  </section>
);

export default FinalCTASection;
