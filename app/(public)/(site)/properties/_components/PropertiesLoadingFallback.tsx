const PropertiesLoadingFallback = () => (
  <div className="px-6 py-5">
    <div className="flex gap-3 mb-4">
      <div className="h-11 flex-1 bg-cloud/30 rounded-xl animate-pulse" />
      <div className="h-11 w-24 bg-cloud/30 rounded-xl animate-pulse" />
    </div>
    <div className="flex gap-2 mb-5">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="h-8 bg-cloud/30 rounded-full animate-pulse"
          style={{ width: `${60 + i * 10}px` }}
        />
      ))}
    </div>
    <div className="flex justify-between items-center mb-4">
      <div className="h-5 w-32 bg-cloud/30 rounded animate-pulse" />
      <div className="h-8 w-40 bg-cloud/30 rounded-lg animate-pulse" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-cloud border border-wire rounded-xl overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white">
          <div className="h-44 bg-cloud/30 animate-pulse" />
          <div className="p-3.5 flex flex-col gap-2">
            <div className="h-4 bg-cloud/30 rounded animate-pulse w-1/2" />
            <div className="h-3 bg-cloud/30 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-cloud/30 rounded animate-pulse w-1/3 mt-2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PropertiesLoadingFallback;
