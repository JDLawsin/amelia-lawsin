export const COOKIE_CONSENT_KEY = "amelia:cookie-consent";

export type CookieConsentValue = "accepted" | "declined";

export const COOKIE_CONSENT_CHANGE_EVENT = "cookie-consent-change";

export const getCookieConsent = (): CookieConsentValue | null => {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (value === "accepted" || value === "declined") {
      return value;
    }
  } catch {
    // Ignore storage errors (private mode, blocked storage).
  }

  return null;
};

export const setCookieConsent = (value: CookieConsentValue): void => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
    window.dispatchEvent(
      new CustomEvent<CookieConsentValue>(COOKIE_CONSENT_CHANGE_EVENT, {
        detail: value,
      }),
    );
  } catch {
    // Ignore storage errors.
  }
};

export const hasAnalyticsConsent = (): boolean =>
  getCookieConsent() === "accepted";
