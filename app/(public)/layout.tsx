import type { ReactNode } from "react";
import CookieConsentBanner from "@/components/legal/CookieConsentBanner";

type Props = {
  children: ReactNode;
};

/** Pass-through wrapper; route groups (site) and (legal) supply their own chrome. */
const PublicLayout = ({ children }: Props) => (
  <>
    {children}
    <CookieConsentBanner />
  </>
);

export default PublicLayout;
