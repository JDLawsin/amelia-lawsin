const BlogPageSkeleton = () => (
  <div className="px-6 py-6">
    <div className="grid grid-cols-3 gap-3 h-70 mb-8">
      <div className="col-span-2 bg-cloud rounded-2xl animate-pulse" />
      <div className="flex flex-col gap-3">
        <div className="flex-1 bg-cloud rounded-xl animate-pulse" />
        <div className="flex-1 bg-cloud rounded-xl animate-pulse" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-wire rounded-xl overflow-hidden animate-pulse"
        >
          <div className="h-44 bg-cloud" />
          <div className="p-4 flex flex-col gap-2">
            <div className="h-3 bg-cloud rounded w-1/3" />
            <div className="h-4 bg-cloud rounded w-3/4" />
            <div className="h-3 bg-cloud rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default BlogPageSkeleton;
