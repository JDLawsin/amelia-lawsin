"use client";

import { Button } from "@/components/ui/shadcn/button";
import useUpdateQueryString from "@/hooks/useQueryString";
import { ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";

type BlogLoadMoreProps = {
  showing: number;
  total: number;
  pageSize: number;
};

const BlogLoadMore = ({ showing, total }: BlogLoadMoreProps) => {
  const searchParams = useSearchParams();
  const updateQueryString = useUpdateQueryString();

  if (showing >= total) return null;

  const currentPage = Number(searchParams.get("page") ?? "1");
  const remaining = total - showing;

  return (
    <div className="flex flex-col items-center gap-2 py-8">
      <Button
        variant="outline"
        onClick={() => updateQueryString({ page: String(currentPage + 1) })}
        className="gap-2 px-8 h-10 border-ink text-ink hover:bg-ink hover:text-white transition-colors rounded-full text-sm font-medium"
      >
        Load more articles
        <ChevronDown className="w-4 h-4" />
      </Button>
      <p className="text-xs text-fog">
        Showing {showing} of {total} articles
        {remaining > 0 && ` · ${remaining} more`}
      </p>
    </div>
  );
};

export default BlogLoadMore;
