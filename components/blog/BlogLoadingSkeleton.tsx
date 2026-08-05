/** Full-page skeleton for the blog route loading state.
 *  Mirrors hero, featured grid, tag bar, article grid, and CTA heights so the
 *  footer stays stable when streamed content replaces this placeholder (CLS). */
const BlogLoadingSkeleton = () => (
  <main className="bg-white min-h-screen" aria-busy="true" aria-label="Loading blog">
    <div className="bg-cloud border-b border-wire px-6 py-10">
      <div className="max-w-7xl mx-auto flex items-end justify-between">
        <div>
          <p className="text-xs font-medium text-ash uppercase tracking-widest mb-3">
            Real Estate Insights
          </p>
          <h1 className="text-4xl font-serif font-medium text-ink tracking-tight leading-tight mb-3">
            Guides, tips &amp;
            <br />
            market updates
          </h1>
          <p className="text-sm text-ash leading-relaxed max-w-md">
            Expert advice on buying, financing, and investing in Cebu real
            estate — for locals, OFWs, and international buyers.
          </p>
        </div>
        <div className="hidden md:block text-right" aria-hidden="true">
          <div className="h-10 w-12 bg-wire/40 rounded animate-pulse motion-reduce:animate-none mx-auto" />
          <div className="h-3 w-24 bg-wire/30 rounded animate-pulse motion-reduce:animate-none mt-2 ml-auto" />
        </div>
      </div>
    </div>

    <div className="px-6 pt-8 pb-0 max-w-7xl mx-auto" aria-hidden="true">
      <div className="h-3 w-32 bg-wire/40 rounded mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-70">
        <div className="md:col-span-2 bg-cloud rounded-2xl animate-pulse motion-reduce:animate-none" />
        <div className="flex flex-col gap-3">
          <div className="flex-1 bg-cloud rounded-xl animate-pulse motion-reduce:animate-none" />
          <div className="flex-1 bg-cloud rounded-xl animate-pulse motion-reduce:animate-none" />
        </div>
      </div>
      <div className="mt-8" />
    </div>

    <div className="max-w-7xl mx-auto px-6 min-h-[36rem]" aria-hidden="true">
      <div className="flex items-center gap-2 py-3 overflow-hidden">
        <div className="h-3 w-10 bg-wire/40 rounded shrink-0" />
        <div className="h-8 w-14 bg-cloud rounded-full border border-wire shrink-0" />
        <div className="h-8 w-24 bg-cloud rounded-full border border-wire shrink-0" />
        <div className="h-8 w-20 bg-cloud rounded-full border border-wire shrink-0" />
        <div className="h-8 w-28 bg-cloud rounded-full border border-wire shrink-0" />
      </div>

      <div className="pt-8">
        <div className="h-3 w-24 bg-wire/40 rounded mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white border border-wire rounded-2xl overflow-hidden"
            >
              <div className="aspect-video bg-cloud animate-pulse motion-reduce:animate-none" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-3 w-16 bg-cloud rounded" />
                <div className="h-4 w-full bg-cloud rounded" />
                <div className="h-3 w-full bg-cloud rounded" />
                <div className="h-3 w-2/3 bg-cloud rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="px-6 py-12 max-w-7xl mx-auto" aria-hidden="true">
      <div className="bg-ink rounded-2xl px-8 py-7 min-h-[7.5rem]" />
    </div>
  </main>
);

export default BlogLoadingSkeleton;
