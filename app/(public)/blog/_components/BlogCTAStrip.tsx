import Link from "next/link";

const BlogCTAStrip = () => (
  <div className="bg-ink rounded-2xl px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div>
      <p className="text-lg font-serif font-medium text-white leading-snug mb-1">
        Ready to find your dream property?
      </p>
      <p className="text-xs text-white/50">
        Browse Amelia&apos;s listings across Cebu — condos, houses, lots & more
      </p>
    </div>
    <Link
      href="/properties"
      className="shrink-0 bg-white text-ink text-sm font-medium px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors"
    >
      Browse properties →
    </Link>
  </div>
);

export default BlogCTAStrip;
