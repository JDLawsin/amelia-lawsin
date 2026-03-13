import Link from "next/link";
import { Button } from "@/components/ui/shadcn/button";
import clsx from "clsx";

const HeroSection = () => (
  <section className="grid grid-cols-1 md:grid-cols-2 bg-brand-green-subtle">
    <div className="flex flex-col justify-center gap-5 px-8 py-16 md:px-16 xl:px-24 border-r border-brand-green-muted">
      <div
        className={clsx(
          "flex items-center w-fit",
          "text-brand-gold text-sm font-medium",
          "px-4 h-9 rounded-full",
          "border border-brand-gold bg-brand-gold/10",
        )}
      >
        {"Licensed Real Estate Broker · Cebu"}
      </div>

      <h1 className="text-4xl xl:text-5xl font-serif font-semibold text-brand-green leading-tight">
        {"Find Your Dream"} <br className="hidden md:block" />
        {"Property in Cebu"}
      </h1>

      <p className="text-sm text-brand-green-light leading-relaxed">
        {"Trusted by local buyers, OFWs, and international investors"}{" "}
        <br className="hidden md:block" />
        {"across the Philippines"}
      </p>

      <div className="flex flex-wrap gap-3">
        <Button
          asChild
          className="h-11 px-6 bg-brand-green text-white hover:bg-brand-green/90"
        >
          <Link href="/properties">{"Browse properties"}</Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-11 px-6 border-brand-gold text-brand-gold bg-transparent hover:bg-brand-gold/10 hover:text-brand-gold"
        >
          <Link href="/contact">{"Contact Amelia"}</Link>
        </Button>
      </div>
    </div>

    <div className="relative hidden md:flex items-end justify-end bg-brand-green-muted min-h-105">
      {/* Replace with next/image when I have a real photo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs text-brand-green-light opacity-50">
          {"Professional photo of Amelia / luxury property"}
        </span>
      </div>

      <div className="relative z-10 m-6 bg-white rounded-lg border border-brand-green-muted shadow-sm p-4 min-w-45">
        <p className="text-xs text-brand-green-light mb-1">
          {"Latest listing"}
        </p>
        <p className="text-sm font-semibold text-brand-green">
          {"2BR Condo · IT Park"}
        </p>
        <p className="text-sm font-medium text-brand-gold">{"₱5,200,000"}</p>
      </div>
    </div>
  </section>
);

export default HeroSection;
