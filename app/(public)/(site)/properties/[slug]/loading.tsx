export default function PropertyDetailLoading() {
  return (
    <main
      className="bg-white min-h-screen"
      role="status"
      aria-live="polite"
      aria-label="Loading property details"
    >
      <div className="px-6 max-w-7xl mx-auto py-3 flex items-center gap-2">
        <div className="h-3 w-10 bg-cloud rounded animate-pulse motion-reduce:animate-none" />
        <span className="text-xs text-wire">/</span>
        <div className="h-3 w-16 bg-cloud rounded animate-pulse motion-reduce:animate-none" />
        <span className="text-xs text-wire">/</span>
        <div className="h-3 w-32 bg-cloud rounded animate-pulse motion-reduce:animate-none" />
      </div>

      <div className="px-6 max-w-7xl mx-auto w-full">
        <div className="relative grid grid-cols-3 grid-rows-2 gap-0.5 aspect-[16/9] w-full">
          <div className="col-span-2 row-span-2 bg-cloud rounded-l-2xl animate-pulse motion-reduce:animate-none" />
          <div className="bg-cloud rounded-tr-2xl animate-pulse motion-reduce:animate-none" />
          <div className="bg-cloud rounded-br-2xl animate-pulse motion-reduce:animate-none" />
        </div>
      </div>

      <div className="px-6 pt-5 pb-3 max-w-7xl mx-auto flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="h-6 w-3/4 bg-cloud rounded animate-pulse motion-reduce:animate-none mb-2" />
          <div className="h-3 w-1/3 bg-cloud rounded animate-pulse motion-reduce:animate-none" />
        </div>
        <div className="h-11 w-24 bg-cloud rounded-xl animate-pulse motion-reduce:animate-none shrink-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-0 px-6 max-w-7xl mx-auto">
        <div className="py-6 lg:pr-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="h-6 w-20 bg-cloud rounded-full animate-pulse motion-reduce:animate-none" />
            <div className="h-6 w-24 bg-cloud rounded-full animate-pulse motion-reduce:animate-none" />
          </div>

          <div className="h-8 w-1/3 bg-cloud rounded animate-pulse motion-reduce:animate-none mb-5" />

          <div className="grid grid-cols-4 divide-x divide-wire border border-wire rounded-xl overflow-hidden mb-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="py-3 px-2 bg-cloud animate-pulse motion-reduce:animate-none h-16" />
            ))}
          </div>

          <div className="mb-5">
            <div className="h-4 w-40 bg-cloud rounded animate-pulse motion-reduce:animate-none mb-3" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-cloud rounded animate-pulse motion-reduce:animate-none" />
              <div className="h-3 w-full bg-cloud rounded animate-pulse motion-reduce:animate-none" />
              <div className="h-3 w-5/6 bg-cloud rounded animate-pulse motion-reduce:animate-none" />
              <div className="h-3 w-4/5 bg-cloud rounded animate-pulse motion-reduce:animate-none" />
            </div>
          </div>

          <div className="my-5" />

          <div className="mb-5">
            <div className="h-4 w-32 bg-cloud rounded animate-pulse motion-reduce:animate-none mb-3" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-cloud rounded-lg animate-pulse motion-reduce:animate-none" />
                  <div className="h-3 flex-1 bg-cloud rounded animate-pulse motion-reduce:animate-none" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block py-6 pl-8">
          <div className="sticky top-17 space-y-4">
            <div className="h-8 w-3/4 bg-cloud rounded animate-pulse motion-reduce:animate-none" />
            <div className="h-3 w-full bg-cloud rounded animate-pulse motion-reduce:animate-none" />
            <div className="h-3 w-5/6 bg-cloud rounded animate-pulse motion-reduce:animate-none" />
            <div className="h-10 w-full bg-cloud rounded-xl animate-pulse motion-reduce:animate-none" />
            <div className="h-10 w-full bg-cloud rounded-xl animate-pulse motion-reduce:animate-none" />
          </div>
        </div>
      </div>
    </main>
  );
}
