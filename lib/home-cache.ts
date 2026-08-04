import { unstable_cache } from "next/cache";
import {
  getActiveListingsCount,
  getFeaturedProperties,
  getLatestListing,
} from "@/services/property.service";
import { getLatestBlogs } from "@/services/blog.service";

/** Cached home queries — shared by page-level LCP preloads and streamed content. */
export const getCachedLatestListing = unstable_cache(
  getLatestListing,
  ["home-latest-listing"],
  { revalidate: 300, tags: ["properties", "home"] },
);

export const getCachedFeaturedProperties = unstable_cache(
  getFeaturedProperties,
  ["home-featured-properties"],
  { revalidate: 300, tags: ["properties", "home"] },
);

export const getCachedActiveListingsCount = unstable_cache(
  getActiveListingsCount,
  ["home-active-listings-count"],
  { revalidate: 300, tags: ["properties", "home"] },
);

export const getCachedLatestBlogs = unstable_cache(
  getLatestBlogs,
  ["home-latest-blogs"],
  { revalidate: 300, tags: ["blogs", "home"] },
);
