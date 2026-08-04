export default function BlogDetailLoading() {
  return (
    <main
      className="bg-white min-h-screen"
      role="status"
      aria-live="polite"
      aria-label="Loading article"
    >
      <div className="max-w-7xl mx-auto py-3 flex items-center gap-2 px-6">
        <div className="h-3 w-10 bg-cloud rounded animate-pulse motion-reduce:animate-none" />
        <span className="text-xs text-wire">/</span>
        <div className="h-3 w-12 bg-cloud rounded animate-pulse motion-reduce:animate-none" />
        <span className="text-xs text-wire">/</span>
        <div className="h-3 w-40 bg-cloud rounded animate-pulse motion-reduce:animate-none" />
      </div>

      <header className="max-w-7xl mx-auto px-6 pt-10 pb-8">
        <div className="flex flex-wrap gap-2 mb-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-7 w-20 bg-cloud rounded-full animate-pulse motion-reduce:animate-none"
            />
          ))}
        </div>

        <div className="h-10 md:h-12 w-3/4 bg-cloud rounded animate-pulse motion-reduce:animate-none mb-4" />

        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-cloud rounded animate-pulse motion-reduce:animate-none" />
          <div className="h-4 w-5/6 bg-cloud rounded animate-pulse motion-reduce:animate-none" />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-5">
          <div className="h-4 w-24 bg-cloud rounded animate-pulse motion-reduce:animate-none" />
          <span className="text-wire">·</span>
          <div className="h-4 w-20 bg-cloud rounded animate-pulse motion-reduce:animate-none" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="w-full h-64 md:h-100 bg-cloud rounded-2xl animate-pulse motion-reduce:animate-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-0">
          <div className="py-2 lg:pr-12 pb-12">
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-full bg-cloud rounded animate-pulse motion-reduce:animate-none"
                />
              ))}
            </div>

            <div className="mt-10 pt-6">
              <div className="h-3 w-12 bg-cloud rounded animate-pulse motion-reduce:animate-none mb-3" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-7 w-20 bg-cloud rounded-full animate-pulse motion-reduce:animate-none"
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 bg-cloud rounded-2xl p-5 flex items-start gap-4">
              <div className="w-11 h-11 bg-white rounded-full animate-pulse motion-reduce:animate-none shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 bg-white rounded animate-pulse motion-reduce:animate-none" />
                <div className="h-3 w-1/2 bg-white rounded animate-pulse motion-reduce:animate-none" />
                <div className="h-3 w-full bg-white rounded animate-pulse motion-reduce:animate-none" />
              </div>
            </div>
          </div>

          <div className="hidden lg:block py-2 pl-8">
            <div className="sticky top-18 flex flex-col gap-4">
              <div className="bg-cloud rounded-xl p-5 space-y-3">
                <div className="h-4 w-3/4 bg-white rounded animate-pulse motion-reduce:animate-none" />
                <div className="h-3 w-full bg-white rounded animate-pulse motion-reduce:animate-none" />
                <div className="h-3 w-5/6 bg-white rounded animate-pulse motion-reduce:animate-none" />
                <div className="h-3 w-4/5 bg-white rounded animate-pulse motion-reduce:animate-none" />
              </div>

              <div className="bg-ink rounded-xl p-5 space-y-3">
                <div className="h-4 w-3/4 bg-white/20 rounded animate-pulse motion-reduce:animate-none" />
                <div className="h-3 w-full bg-white/20 rounded animate-pulse motion-reduce:animate-none" />
                <div className="h-10 w-full bg-white/20 rounded-xl animate-pulse motion-reduce:animate-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
