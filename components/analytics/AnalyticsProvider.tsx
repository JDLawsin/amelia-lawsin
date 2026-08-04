"use client";

import Script from "next/script";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * Loads Google Analytics 4 when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 *
 * Setup:
 * 1. Create a GA4 property at https://analytics.google.com
 * 2. Add to .env.local: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 * 3. Update the Privacy Policy "Analytics" section when enabling
 *
 * Alternatives:
 * - @vercel/analytics — page views only, no cookies, no button tracking
 * - Plausible / Fathom — privacy-focused, paid, simple dashboards
 */
const AnalyticsProvider = ({ children }: Props) => {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!measurementId) {
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
