import FeaturedProperties from "@/components/home/FeaturedProperties";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import type { FeaturedPropertyItem } from "@/components/home/FeaturedProperties";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FinalCTASection from "@/components/home/FinalCTASection";
import BlogPreviewSection from "@/components/home/BlogPreviewSection";

export const SAMPLE_PROPERTIES: FeaturedPropertyItem[] = [
  {
    id: "1",
    title: "2-Bedroom Condo at Avida Towers Cebu",
    slug: "2br-condo-avida-towers-cebu",
    type: "CONDO",
    status: "FOR_SALE",
    isFeatured: true,
    price: 5200000,
    priceLabel: null,
    city: "Cebu City",
    barangay: "Lahug",
    bedrooms: 2,
    bathrooms: 1,
    floorArea: 45,
    images: [
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        isPrimary: true,
      },
    ],
  },
  {
    id: "2",
    title: "3-Bedroom House & Lot in Consolacion",
    slug: "3br-house-lot-consolacion-cebu",
    type: "HOUSE_AND_LOT",
    status: "FOR_SALE",
    isFeatured: true,
    price: 8500000,
    priceLabel: null,
    city: "Consolacion",
    barangay: "Tayud",
    bedrooms: 3,
    bathrooms: 2,
    floorArea: 120,
    images: [
      {
        url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
        isPrimary: true,
      },
    ],
  },
  {
    id: "3",
    title: "ATO Residences — Pre-selling Condo in Mandaue",
    slug: "ato-residences-pre-selling-mandaue",
    type: "CONDO",
    status: "PRE_SELLING",
    isFeatured: true,
    price: null,
    priceLabel: "Starts at ₱3,500,000",
    city: "Mandaue City",
    barangay: "Cambaro",
    bedrooms: null,
    bathrooms: null,
    floorArea: null,
    images: [
      {
        url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
        isPrimary: true,
      },
    ],
  },
];

// constants/sample-blogs.ts
// Temporary sample data for UI development
// Replace with real DB data when blogs are added via Supabase

import type { BlogPreviewItem } from "@/components/home/BlogPreviewSection";

export const SAMPLE_BLOGS: BlogPreviewItem[] = [
  {
    id: "1",
    title: "Best Condos to Buy in Cebu 2025: A Complete Guide for OFWs",
    slug: "best-condos-to-buy-in-cebu-2025",
    excerpt:
      "Planning to invest in a condo in Cebu but not sure where to start? This guide breaks down the top condo developments across Cebu City, Mandaue, and Lapu-Lapu — with price ranges, location advantages, and financing options perfect for OFWs.",
    coverImage:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    publishedAt: new Date("2025-03-10"),
    tags: [
      {
        blogId: "1",
        tagId: "t1",
        tag: { name: "OFW Guide", slug: "ofw-guide" },
      },
    ],
  },
  {
    id: "2",
    title: "Pag-IBIG vs Bank Loan: Which is Better for Buying a Home in Cebu?",
    slug: "pag-ibig-vs-bank-loan-cebu",
    excerpt:
      "One of the most common questions from first-time homebuyers is: should I use Pag-IBIG or a bank loan? We break down the interest rates, eligibility, maximum loanable amounts, and which option makes more sense depending on your situation.",
    coverImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    publishedAt: new Date("2025-03-05"),
    tags: [
      {
        blogId: "2",
        tagId: "t2",
        tag: { name: "Financing", slug: "financing" },
      },
    ],
  },
  {
    id: "3",
    title: "Pre-selling vs Ready for Occupancy (RFO): What You Need to Know",
    slug: "pre-selling-vs-rfo-cebu",
    excerpt:
      "Should you buy a pre-selling condo or an RFO unit? Both have their pros and cons depending on your timeline, budget, and goals. This article helps you decide which type of property makes the most sense for your situation.",
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    publishedAt: new Date("2025-02-28"),
    tags: [
      {
        blogId: "3",
        tagId: "t3",
        tag: { name: "Investment", slug: "investment" },
      },
    ],
  },
];

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StatsBar activeListings={50} />
      <FeaturedProperties properties={SAMPLE_PROPERTIES} />
      <WhyChooseSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <BlogPreviewSection blogs={SAMPLE_BLOGS} />
      <FinalCTASection />
    </main>
  );
}
