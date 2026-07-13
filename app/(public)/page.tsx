import type { Metadata } from "next";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FinalCTASection from "@/components/home/FinalCTASection";
import BlogPreviewSection from "@/components/home/BlogPreviewSection";
import {
  getActiveListingsCount,
  getFeaturedProperties,
  getLatestListing,
} from "@/services/property.service";
import { getLatestBlogs } from "@/services/blog.service";
import { SITE_CONFIG } from "@/constants";

const title = `${SITE_CONFIG.name} — Licensed Real Estate Agent in ${SITE_CONFIG.location}`;
const description = `Find condos, house & lot, townhouses, and pre-selling properties in ${SITE_CONFIG.location} with ${SITE_CONFIG.name}. Get expert guidance on Pag-IBIG, bank, and in-house financing — trusted by local buyers, OFWs, and investors.`;

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
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const Home = async () => {
  const [featuredProperties, activeListingsCount, latestListing, latestBlogs] =
    await Promise.all([
      getFeaturedProperties(),
      getActiveListingsCount(),
      getLatestListing(),
      getLatestBlogs(),
    ]);

  return (
    <main className="bg-white">
      <HeroSection latestListing={latestListing} />
      <StatsBar activeListings={activeListingsCount} />
      <FeaturedProperties properties={featuredProperties} />
      <WhyChooseSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <BlogPreviewSection blogs={latestBlogs} />
      <FinalCTASection />
    </main>
  );
};

export default Home;
