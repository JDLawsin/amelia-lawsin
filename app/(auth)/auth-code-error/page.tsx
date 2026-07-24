import type { Metadata } from "next";
import Link from "next/link";
import { BrandPanel } from "../login/_components/BrandPanel";

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export const metadata: Metadata = {
  title: "Sign-in failed — Amelia Lawsin Real Estate Agent",
  description: "We couldn't complete your sign-in. Please try again.",
};

const AuthCodeErrorPage = async ({ searchParams }: Props) => {
  const { next } = await searchParams;
  const loginHref = `/login${next ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <article className="w-full max-w-240 bg-white rounded-[20px] overflow-hidden border border-wire shadow-apple-lg grid lg:grid-cols-2">
        <BrandPanel />

        <div className="flex flex-col justify-center px-8 py-12 lg:px-12">
          <h1 className="text-2xl font-serif font-medium text-ink tracking-tight mb-3">
            Sign-in failed
          </h1>
          <p className="text-sm text-ash mb-7">
            We couldn&apos;t complete your sign-in. Please try again or contact
            support if the problem persists.
          </p>

          <Link
            href={loginHref}
            className="inline-flex items-center justify-center w-full h-10 bg-ink text-white text-sm font-medium rounded-xl hover:bg-ink/90 transition-colors"
          >
            Try again
          </Link>
        </div>
      </article>
    </section>
  );
};

export default AuthCodeErrorPage;
