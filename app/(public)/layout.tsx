import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const PublicLayout = ({ children }: Props) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

export default PublicLayout;
