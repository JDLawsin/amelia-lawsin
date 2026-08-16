"use client";

import Script from "next/script";
import type { ReactNode } from "react";
import { useCookieConsent } from "@/hooks/useCookieConsent";

type Props = {
  children: ReactNode;
};

/**
 * Loads Google Analytics 4 when NEXT_PUBLIC_GA_MEASUREMENT_ID is set and the
 * visitor has accepted analytics cookies via the consent banner.
 */
const AnalyticsProvider = ({ children }: Props) => {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const { hasAnalyticsConsent } = useCookieConsent();

  if (!measurementId || !hasAnalyticsConsent) {
    return children;
  }

  return (
    <>
      {children}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
};

export default AnalyticsProvider;
