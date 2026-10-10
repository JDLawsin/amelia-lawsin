"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCookieConsent,
  setCookieConsent,
  type CookieConsentValue,
} from "@/lib/cookie-consent";

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const CookieConsentBanner = () => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(getCookieConsent() === null);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const persistChoice = useCallback((value: CookieConsentValue) => {
    setCookieConsent(value);
    setVisible(false);
  }, []);

  const handleAccept = useCallback(
    () => persistChoice("accepted"),
    [persistChoice],
  );
  const handleDecline = useCallback(
    () => persistChoice("declined"),
    [persistChoice],
  );

  useEffect(() => {
    if (!visible) return;

    const container = dialogRef.current;
    if (!container) return;

    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((element) => !element.hasAttribute("disabled"));

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleDecline();
        return;
      }

      if (event.key !== "Tab" || focusables.length === 0) return;

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
        return;
      }

      if (document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [visible, handleDecline]);

  if (!visible) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto max-w-4xl rounded-2xl border border-wire bg-white p-4 sm:p-5 shadow-apple-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p
              id="cookie-consent-title"
              className="text-sm font-medium text-ink mb-1"
            >
              Cookie preferences
            </p>
            <p
              id="cookie-consent-description"
              className="text-xs text-ash leading-relaxed"
            >
              We use optional analytics cookies to understand how visitors use
              this site. You can accept or decline analytics. See our{" "}
              <Link
                href="/privacy-policy"
                className="text-ink underline underline-offset-2 hover:text-ash"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleDecline}
              className="h-10 px-4 text-sm font-medium text-ash border border-wire rounded-xl hover:text-ink hover:border-ink transition-colors"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="h-10 px-4 text-sm font-medium text-white bg-ink rounded-xl hover:bg-ink/90 transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
