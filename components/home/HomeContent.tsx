import FeaturedProperties from "@/components/home/FeaturedProperties";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BlogPreviewSection from "@/components/home/BlogPreviewSection";
import FinalCTASection from "@/components/home/FinalCTASection";
import {
  getCachedActiveListingsCount,
  getCachedFeaturedProperties,
  getCachedLatestBlogs,
  getCachedLatestListing,
} from "@/lib/home-cache";
import { getSiteUrl } from "@/lib/site";
import { organizationJsonLd } from "@/lib/structured-data";
import JsonLd from "@/components/ui/JsonLd";

const HomeContent = async () => {
  const [featuredProperties, activeListingsCount, latestListing, latestBlogs] =
    await Promise.all([
      getCachedFeaturedProperties(),
      getCachedActiveListingsCount(),
      getCachedLatestListing(),
      getCachedLatestBlogs(),
    ]);

  const baseUrl = getSiteUrl();

  return (
    <main className="bg-white">
      <JsonLd data={organizationJsonLd(baseUrl)} />
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

export default HomeContent;
