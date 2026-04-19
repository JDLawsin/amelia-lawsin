import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import AuthProvider from "@/providers/AuthProvider";
import { getUser } from "@/services/auth.service";
import { getRole } from "@/services/profile.service";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const PublicLayout = async ({ children }: Props) => {
  const user = await getUser();
  const profile = user ? await getRole(user.id) : null;

  return (
    <AuthProvider initialUser={user} userRole={profile?.role || null}>
      <Navbar />
      {children}
      <Footer />
    </AuthProvider>
  );
};

export default PublicLayout;
