import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  CREDENTIALS,
  SITE_CONFIG,
  STATIC_STATS,
  TESTIMONIALS,
} from "@/constants";
import { getActiveListingsCount } from "@/services/property.service";

export const metadata: Metadata = {
  title: "About Amelia Lawsin — Licensed Real Estate Agent in Cebu",
  description:
    "10+ years helping local buyers, OFWs, and international investors find their dream property in Cebu. PRC Licensed Agent. Free consultation, no commitment required.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Amelia Lawsin — Licensed Real Estate Agent in Cebu",
    description:
      "10+ years helping local buyers, OFWs, and international investors find their dream property in Cebu.",
    type: "profile",
  },
};

const SPECIALIZATIONS = [
  {
    title: "OFW & Expat Buyers",
    description:
      "Remote buying process, Pag-IBIG OFW loans, and virtual property tours for buyers abroad.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <line x1="3" y1="9" x2="21" y2="9" strokeLinecap="round" />
        <line x1="3" y1="15" x2="21" y2="15" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Cebu Condominiums",
    description:
      "IT Park, Cebu Business Park, Mandaue, and Mactan — pre-selling and resale units across all budgets.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: "House & Lot",
    description:
      "From Consolacion to Minglanilla — residential subdivisions, townhouses, and lots across Cebu.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 3H8L4 7h16L16 3z" />
      </svg>
    ),
  },
  {
    title: "Pag-IBIG Financing",
    description:
      "Step-by-step guidance through Pag-IBIG housing loan applications — for local and OFW buyers.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Beach & Vacation Properties",
    description:
      "Mactan beachfront lots, tourism-zoned properties, and Airbnb-ready units for investors.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: "Investment Advisory",
    description:
      "High-yield rental properties and pre-selling opportunities with proven ROI across Cebu.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

const SectionLabel = ({ children }: { children: string }) => (
  <p className="text-[10px] font-medium text-fog uppercase tracking-[0.15em] text-center mb-8">
    {children}
  </p>
);

const AboutPage = async () => {
  const activeListings = await getActiveListingsCount();

  const stats = [
    { value: STATIC_STATS.propertiesSold, label: "Properties sold" },
    { value: STATIC_STATS.yearsExperience, label: "Years in Cebu" },
    { value: `${activeListings}+`, label: "Active listings" },
    { value: STATIC_STATS.clientRating, label: "Client rating" },
  ];

  return (
    <main className="bg-white">
      <section className="relative h-130 md:h-145 bg-cloud overflow-hidden flex items-end">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-fog opacity-50">
            Professional photo of Amelia Lawsin
          </span>
        </div>

        {/* Uncomment when you have a real photo:
        <Image
          src="/images/amelia-hero.jpg"
          alt="Amelia Lawsin — Licensed Real Estate Agent in Cebu"
          fill
          className="object-cover object-top"
          priority
        />
        */}

        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />

        <div className="relative z-10 w-full px-6 pb-10 max-w-7xl mx-auto">
          <p className="text-[10px] font-medium text-white/55 uppercase tracking-[0.2em] mb-3">
            Licensed Real Estate Agent · Cebu, Philippines
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-white tracking-tight leading-tight mb-2">
            {SITE_CONFIG.name}
          </h1>
          <p className="text-sm text-white/55">
            {STATIC_STATS.yearsExperience} years · {STATIC_STATS.propertiesSold}{" "}
            properties sold · PRC Lic. No. {SITE_CONFIG.prcLicenseNo}
          </p>
        </div>
      </section>

      <section className="border-b border-wire">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-wire">
          {stats.map((stat) => (
            <div key={stat.label} className="px-8 py-7">
              <p className="text-4xl font-serif font-medium text-ink tracking-tight leading-none mb-1.5">
                {stat.value}
              </p>
              <p className="text-xs text-fog">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-wire">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-medium text-ink tracking-tight leading-snug mb-5">
            A Cebuano agent helping locals, OFWs, and international buyers find
            their place to call home.
          </h2>
          <p className="text-sm text-ash leading-relaxed max-w-xl mx-auto">
            Since 2013, I&apos;ve guided hundreds of families and investors
            through one of the most important decisions of their lives — buying
            property in Cebu. My approach is simple: honest advice, transparent
            process, and your best interest always first.
          </p>
        </div>
      </section>

      <section className="border-b border-wire">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-wire">
          <div className="px-6 lg:px-12 py-14 flex flex-col justify-center gap-5">
            <p className="text-[10px] font-medium text-fog uppercase tracking-[0.15em]">
              My story
            </p>
            <h2 className="text-2xl font-serif font-medium text-ink tracking-tight leading-snug">
              From a dream of helping families,
              <br className="hidden md:block" />
              to 200+ keys handed over.
            </h2>
            <p className="text-sm text-ash leading-relaxed">
              I grew up watching Cebu transform — from a provincial city to one
              of the most exciting property markets in the Philippines. My
              mission has always been the same: make buying a home less
              intimidating, more transparent, and genuinely rewarding for every
              client.
            </p>
            <p className="text-sm text-ash leading-relaxed">
              Whether you&apos;re an OFW buying remotely, a first-time buyer
              navigating Pag-IBIG, or an investor looking for the next
              opportunity — I bring the same level of care and expertise to
              every transaction.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="relative flex-1 min-h-60 bg-cloud flex items-center justify-center">
              <span className="text-xs text-fog opacity-50">
                Photo — Amelia at a property
              </span>
              {/* Uncomment when you have a real photo:
              <Image
                src="/images/amelia-story.jpg"
                alt="Amelia Lawsin at a property showing in Cebu"
                fill
                className="object-cover"
              />
              */}
            </div>
            <div className="bg-ink px-8 py-7">
              <p className="text-sm font-serif font-medium text-white/90 leading-relaxed italic mb-3">
                &ldquo;My goal is to find you the right property at the right
                price — with as little stress as possible.&rdquo;
              </p>
              <p className="text-xs text-white/40">— {SITE_CONFIG.name}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cloud border-b border-wire">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <SectionLabel>Credentials & accreditations</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px  rounded-2xl overflow-hidden">
            {CREDENTIALS.map((cred) => (
              <div key={cred.abbr} className="bg-white px-6 py-6">
                <p className="text-2xl font-serif font-medium text-ink tracking-tight mb-2">
                  {cred.abbr}
                </p>
                <p className="text-sm font-medium text-ink mb-1">
                  {cred.title}
                </p>
                <p className="text-xs text-ash mb-1">{cred.detail}</p>
                <p className="text-[10px] text-fog leading-relaxed">
                  {cred.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-wire">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <SectionLabel>Specializations</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPECIALIZATIONS.map((spec) => (
              <div
                key={spec.title}
                className="border border-wire rounded-2xl p-6 hover:shadow-apple-sm transition-shadow duration-200"
              >
                <div className="w-9 h-9 bg-ink rounded-xl flex items-center justify-center mb-4">
                  {spec.icon}
                </div>
                <h3 className="text-sm font-medium text-ink mb-2">
                  {spec.title}
                </h3>
                <p className="text-xs text-ash leading-relaxed">
                  {spec.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-wire">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <SectionLabel>What clients say</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px rounded-2xl overflow-hidden">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white px-6 py-7 flex flex-col">
                <p className="text-3xl text-wire font-serif leading-none mb-4">
                  &ldquo;
                </p>
                <p className="text-sm text-ash leading-relaxed flex-1 mb-5">
                  {t.message}
                </p>
                <div className="flex items-center gap-3 pt-4">
                  <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-semibold text-white">
                      {t.initials}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-ink">{t.name}</p>
                    <p className="text-[10px] text-fog">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-white tracking-tight leading-tight mb-3">
            Let&apos;s find your dream
            <br className="hidden md:block" />
            property together.
          </h2>
          <p className="text-sm text-white/45 mb-10">
            Free consultation · No commitment required
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={SITE_CONFIG.messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-ink text-sm font-medium px-7 py-3 rounded-full hover:bg-white/90 transition-colors"
            >
              Message on Messenger
            </a>
            <Link
              href="/properties"
              className="border border-white/20 text-white/60 text-sm px-7 py-3 rounded-full hover:bg-white/10 hover:text-white transition-colors"
            >
              Browse properties
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
