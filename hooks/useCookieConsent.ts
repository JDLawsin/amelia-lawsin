"use client";

import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_CHANGE_EVENT,
  getCookieConsent,
  type CookieConsentValue,
} from "@/lib/cookie-consent";

export const useCookieConsent = () => {
  const [consent, setConsent] = useState<CookieConsentValue | null>(null);

  useEffect(() => {
    const sync = () => setConsent(getCookieConsent());
    sync();

    const handleChange = (event: Event) => {
      const customEvent = event as CustomEvent<CookieConsentValue>;
      setConsent(customEvent.detail ?? getCookieConsent());
    };

    window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, handleChange);
    return () =>
      window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, handleChange);
  }, []);

  return {
    consent,
    hasAnalyticsConsent: consent === "accepted",
  };
};
