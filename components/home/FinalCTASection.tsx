import { SITE_CONFIG } from "@/constants";
import Link from "next/link";
import { Button } from "../ui/shadcn/button";

const FinalCTASection = () => (
  <section className="py-16 px-4 bg-ink">
    <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-5">
      <h2 className="text-2xl md:text-3xl font-serif font-semibold text-white leading-snug">
        {"Ready to find your dream property?"}
      </h2>

      <p className="text-sm text-fog leading-relaxed max-w-md">
        {
          "Let Amelia guide you through every step, from browsing to turnover. Reach out now, it's free and no commitment required."
        }
      </p>

      <div className="flex flex-wrap justify-center gap-3 mt-2">
        <Button
          asChild
          className="h-11 px-6 bg-white text-ink hover:bg-white/90 [a]:hover:bg-white/90 font-medium"
        >
          <a
            href={SITE_CONFIG.messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {"Message on Messenger"}
          </a>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-11 px-6 border-wire text-fog bg-transparent hover:bg-white/10 hover:text-white hover:border-white"
        >
          <a href={SITE_CONFIG.smsUrl}>{"Send SMS / Viber"}</a>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-11 px-6 border-wire text-fog bg-transparent hover:bg-white/10 hover:text-white hover:border-white"
        >
          <Link href="/properties">{"Browse properties"}</Link>
        </Button>
      </div>

      <p className="text-xs text-ash mt-2">
        {"Licensed Real Estate Broker · PRC Lic. No."}{" "}
        {SITE_CONFIG.prcLicenseNo}
      </p>
    </div>
  </section>
);

export default FinalCTASection;
