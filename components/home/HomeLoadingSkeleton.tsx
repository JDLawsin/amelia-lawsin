/** Full-page skeleton for the home Suspense boundary.
 *  Mirrors every home section height so the footer position is stable when
 *  streamed content replaces this placeholder (CLS). */
const HomeLoadingSkeleton = () => (
  <main className="bg-white" aria-busy="true" aria-label="Loading homepage">
    <section className="grid grid-cols-1 md:grid-cols-2 bg-cloud">
      <div className="flex flex-col items-center justify-center border-r border-wire md:min-h-105">
        <div className="flex flex-col gap-5 w-full max-w-7xl px-6 py-16 md:py-20">
          <div className="h-3 w-48 rounded bg-wire/50" aria-hidden="true" />
          <div
            className="flex flex-col gap-2 min-h-22 xl:min-h-26"
            aria-hidden="true"
          >
            <div className="h-10 w-full max-w-md rounded bg-wire/50" />
            <div className="h-10 w-full max-w-sm rounded bg-wire/50" />
          </div>
          <div
            className="h-4 w-72 max-w-full rounded bg-wire/40"
            aria-hidden="true"
          />
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

    <section
      className="py-14 px-6 bg-cloud border-b border-wire min-h-[34rem]"
      aria-hidden="true"
    >
      <div className="max-w-7xl mx-auto">
        <div className="h-3 w-36 rounded bg-wire/40 mx-auto mb-3" />
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
      className="py-14 px-6 bg-white border-b border-wire min-h-[24rem]"
      aria-hidden="true"
    >
      <div className="max-w-7xl mx-auto">
        <div className="h-3 w-28 rounded bg-wire/40 mx-auto mb-3" />
        <div className="h-8 w-80 max-w-full rounded bg-wire/50 mx-auto mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-wire p-5 min-h-[9.5rem] bg-cloud/40"
            />
          ))}
        </div>
      </div>
    </section>

    <section
      className="py-14 px-6 bg-cloud border-b border-wire min-h-[22rem]"
      aria-hidden="true"
    >
      <div className="max-w-7xl mx-auto">
        <div className="h-3 w-24 rounded bg-wire/40 mx-auto mb-3" />
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
      className="py-14 px-6 bg-white border-b border-wire min-h-[20rem]"
      aria-hidden="true"
    >
      <div className="max-w-7xl mx-auto">
        <div className="h-3 w-32 rounded bg-wire/40 mx-auto mb-3" />
        <div className="h-8 w-64 max-w-full rounded bg-wire/50 mx-auto mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-wire rounded-2xl overflow-hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white px-6 py-7 min-h-[10rem]" />
          ))}
        </div>
      </div>
    </section>

    <section
      className="py-14 px-6 bg-cloud border-b border-wire min-h-[34rem]"
      aria-hidden="true"
    >
      <div className="max-w-7xl mx-auto">
        <div className="h-3 w-40 rounded bg-wire/40 mx-auto mb-3" />
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
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center gap-5">
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
