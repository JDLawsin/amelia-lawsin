"use client";

import { Button } from "@/components/ui/shadcn/button";
import useUpdateQueryString from "@/hooks/useQueryString";
import { ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";

type LoadMoreProps = {
  showing: number;
  total: number;
  pageSize: number;
};

const LoadMore = ({ showing, total, pageSize }: LoadMoreProps) => {
  const searchParams = useSearchParams();
  const updateQueryString = useUpdateQueryString();

  if (showing >= total) return null;

  const currentPage = Number(searchParams.get("page") ?? "1");
  const remaining = total - showing;

  const handleLoadMore = () => {
    updateQueryString({ page: String(currentPage + 1) });
  };

  return (
    <div className="flex flex-col items-center gap-2 py-8 px-6">
      <Button
        variant="outline"
        onClick={handleLoadMore}
        className="gap-2 px-8 h-10 border-wire text-ink hover:bg-ink hover:text-white transition-colors rounded-lg text-sm font-medium"
      >
        Load more properties
        <ChevronDown className="w-4 h-4" />
      </Button>
      <p className="text-xs text-ash">
        Showing {showing} of {total} properties
        {remaining > 0 && ` · ${remaining} more to load`}
      </p>
    </div>
  );
};

export default LoadMore;
