/** Full-page skeleton for the home Suspense boundary.
 *  Mirrors every home section height so the footer position is stable when
 *  streamed content replaces this placeholder (CLS). */
const HomeLoadingSkeleton = () => (
  <main className="bg-white" aria-busy="true" aria-label="Loading homepage">
    <section
      className="grid grid-cols-1 bg-cloud md:min-h-[34rem] md:grid-cols-[minmax(0,5fr)_minmax(0,8fr)]"
      aria-hidden="true"
    >
      <div
        className="flex flex-col justify-center px-6 pt-14 pb-10 sm:px-8 md:border-r md:border-wire md:px-10 md:py-20 lg:px-14"
      >
        <div className="h-28 w-full max-w-xl rounded bg-wire/50" />
        <div className="mt-6 h-5 w-full max-w-md rounded bg-wire/40" />
        <div className="mt-7 flex flex-wrap gap-3">
          <div className="h-11 w-40 rounded-full bg-wire/50" />
          <div className="h-11 w-36 rounded-full bg-wire/50" />
        </div>
        <div className="mt-7 h-4 w-52 rounded bg-wire/40" />
        <div className="relative -mx-6 mt-10 mb-5 md:hidden sm:-mx-8">
          <div className="aspect-[4/3] max-h-[55vh] bg-wire/30" />
          <div
            className="absolute -bottom-5 right-4 h-[4.5rem] w-48 rounded-xl bg-wire/40"
          />
        </div>
      </div>
      <div className="relative hidden min-h-[34rem] bg-cloud md:block" />
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

    <section
      className="border-b border-wire bg-cloud px-6 py-20 min-h-[34rem] md:py-24"
      aria-hidden="true"
    >
      <div className="max-w-7xl mx-auto">
        <div className="h-8 w-72 max-w-full rounded bg-wire/50 mx-auto mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-wire overflow-hidden bg-white"
            >
              <div className="aspect-[4/3] bg-cloud" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 rounded bg-wire/50" />
                <div className="h-3 w-1/2 rounded bg-wire/40" />
                <div className="h-5 w-1/3 rounded bg-wire/50" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <div className="h-10 w-40 rounded-full bg-wire/50" />
        </div>
      </div>
    </section>

    <section
      className="border-b border-wire bg-white px-6 py-20 min-h-[24rem] md:py-24"
      aria-hidden="true"
    >
      <div className="max-w-7xl mx-auto">
        <div className="h-8 w-80 max-w-full rounded bg-wire/50 mx-auto mb-10" />
        <div className="grid grid-cols-1 divide-y divide-wire border-y border-wire md:grid-cols-3 md:divide-x md:divide-y-0">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="min-h-[9.5rem] px-1 py-8 sm:px-6 md:px-8 md:py-10"
            />
          ))}
        </div>
      </div>
    </section>

    <section
      className="border-b border-wire bg-cloud px-6 py-20 min-h-[22rem] md:py-24"
      aria-hidden="true"
    >
      <div className="max-w-7xl mx-auto">
        <div className="h-8 w-72 max-w-full rounded bg-wire/50 mx-auto mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-wire/50" />
              <div className="h-4 w-24 rounded bg-wire/50" />
              <div className="h-3 w-full max-w-40 rounded bg-wire/40" />
            </div>
          ))}
        </div>
      </div>
    </section>

    <section
      className="border-b border-wire bg-white px-6 py-20 min-h-[20rem] md:py-24"
      aria-hidden="true"
    >
      <div className="max-w-7xl mx-auto">
        <div className="h-8 w-64 max-w-full rounded bg-wire/50 mx-auto mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-wire rounded-2xl overflow-hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white px-6 py-7 min-h-[10rem]" />
          ))}
        </div>
      </div>
    </section>

    <section
      className="border-b border-wire bg-cloud px-6 py-20 min-h-[34rem] md:py-24"
      aria-hidden="true"
    >
      <div className="max-w-7xl mx-auto">
        <div className="h-8 w-96 max-w-full rounded bg-wire/50 mx-auto mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-wire overflow-hidden bg-white"
            >
              <div className="aspect-[16/9] bg-cloud" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-full rounded bg-wire/50" />
                <div className="h-3 w-2/3 rounded bg-wire/40" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <div className="h-10 w-36 rounded-full bg-wire/50" />
        </div>
      </div>
    </section>

    <section className="bg-ink min-h-[16rem]" aria-hidden="true">
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-28 flex flex-col items-center gap-5">
        <div className="h-9 w-80 max-w-full rounded bg-white/10" />
        <div className="h-4 w-96 max-w-full rounded bg-white/10" />
        <div className="flex gap-3 mt-2">
          <div className="h-10 w-36 rounded-full bg-white/10" />
          <div className="h-10 w-32 rounded-full bg-white/10" />
        </div>
      </div>
    </section>
  </main>
);

export default HomeLoadingSkeleton;
