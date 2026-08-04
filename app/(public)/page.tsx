import type { Metadata } from "next";
import { Suspense } from "react";
import HomeContent from "@/components/home/HomeContent";
import HomeLoadingSkeleton from "@/components/home/HomeLoadingSkeleton";
import { SITE_CONFIG } from "@/constants";
import { ogImageMetadata } from "@/lib/og-metadata";

const title = `${SITE_CONFIG.name} — Licensed Real Estate Agent in ${SITE_CONFIG.location}`;
const description = `Find condos, house & lot, townhouses, and pre-selling properties in ${SITE_CONFIG.location} with ${SITE_CONFIG.name}. Get expert guidance on Pag-IBIG, bank, and in-house financing — trusted by local buyers, OFWs, and investors.`;
const ogAlt = `${SITE_CONFIG.name} — Licensed Real Estate Agent in Cebu`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_PH",
    siteName: SITE_CONFIG.name,
    title,
    description,
    url: "/",
    images: ogImageMetadata("/", ogAlt),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ogImageMetadata("/", ogAlt),
  },
};

const Home = () => (
  <Suspense fallback={<HomeLoadingSkeleton />}>
    <HomeContent />
  </Suspense>
);

export default Home;
