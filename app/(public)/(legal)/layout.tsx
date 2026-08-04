import Footer from "@/components/layout/Footer";
import LegalNavbar from "@/components/layout/LegalNavbar";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/** Minimal chrome for static legal pages — no auth fetch, no client providers. */
const LegalLayout = ({ children }: Props) => (
  <div className="flex flex-col">
    <LegalNavbar />
    {children}
    <Footer />
  </div>
);

export default LegalLayout;
