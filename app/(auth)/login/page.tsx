import type { Metadata } from "next";
import { BrandPanel } from "./_components/BrandPanel";
import LoginPanel from "./_components/LoginPanel";

export const metadata: Metadata = {
  title: "Sign in — Amelia Lawsin Real Estate Agent",
  description:
    "Sign in or create an account to browse listings and connect with Amelia.",
};

const LoginPage = () => (
  <section className="flex flex-1 flex-col items-center justify-center px-4 py-12">
    <article className="w-full max-w-240 bg-white rounded-[20px] overflow-hidden border border-wire shadow-apple-lg grid lg:grid-cols-2">
      <BrandPanel />
      <LoginPanel />
    </article>
  </section>
);

export default LoginPage;
