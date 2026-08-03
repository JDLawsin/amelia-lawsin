/** Above-the-fold skeleton for the home page Suspense boundary.
 *  Mirrors HeroSection + StatsBar layout so the footer does not jump when
 *  streamed content replaces this placeholder (CLS). */
const HomeLoadingSkeleton = () => (
  <main className="bg-white" aria-busy="true" aria-label="Loading homepage">
    <section className="grid grid-cols-1 md:grid-cols-2 bg-cloud">
      <div className="flex flex-col items-center justify-center border-r border-wire md:min-h-105">
        <div className="flex flex-col gap-5 w-full max-w-7xl px-6 py-16 md:py-20">
          <div className="h-3 w-48 rounded bg-wire/50" aria-hidden="true" />
          <div className="flex flex-col gap-2 min-h-22 xl:min-h-26" aria-hidden="true">
            <div className="h-10 w-full max-w-md rounded bg-wire/50" />
            <div className="h-10 w-full max-w-sm rounded bg-wire/50" />
          </div>
          <div className="h-4 w-72 max-w-full rounded bg-wire/40" aria-hidden="true" />
          <div className="flex flex-wrap gap-3" aria-hidden="true">
            <div className="h-10 w-36 rounded-full bg-wire/50" />
            <div className="h-10 w-32 rounded-full bg-wire/50" />
          </div>
        </div>
      </div>
      <div
        className="relative hidden md:block min-h-105 bg-cloud border-l border-wire"
        aria-hidden="true"
      />
    </section>

    <section className="border-b border-wire" aria-hidden="true">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-wire">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="px-8 py-7">
            <div className="h-10 w-16 rounded bg-wire/50 mb-1.5" />
            <div className="h-3 w-24 rounded bg-wire/40" />
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default HomeLoadingSkeleton;
