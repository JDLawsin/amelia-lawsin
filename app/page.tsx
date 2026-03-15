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

export const Home = async () => {
  const [featuredProperties, activeListingsCount, latestListing, latestBlogs] =
    await Promise.all([
      getFeaturedProperties(),
      getActiveListingsCount(),
      getLatestListing(),
      getLatestBlogs(),
    ]);

  return (
    <main>
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
