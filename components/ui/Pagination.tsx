"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import useUpdateQueryString from "@/hooks/useQueryString";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  label?: string;
};

const Pagination = ({ page, pageSize, total, label = "items" }: Props) => {
  const updateQueryString = useUpdateQueryString();

  const totalPages = Math.ceil(total / pageSize);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const goTo = (p: number) => updateQueryString({ page: String(p) });

  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-wire bg-cloud/50">
      <p className="text-xs text-fog">
        Showing{" "}
        <span className="font-medium text-ink">
          {from}–{to}
        </span>{" "}
        of <span className="font-medium text-ink">{total}</span> {label}
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => goTo(page - 1)}
            disabled={page <= 1}
            className="h-7 w-7 text-ash"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
            )
            .reduce<(number | "...")[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="text-xs text-fog px-1">
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  variant={page === p ? "default" : "ghost"}
                  size="icon-sm"
                  onClick={() => goTo(p as number)}
                  className={
                    page === p
                      ? "h-7 w-7 bg-ink text-white hover:bg-ink/90"
                      : "h-7 w-7 text-ash"
                  }
                >
                  {p}
                </Button>
              ),
            )}

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => goTo(page + 1)}
            disabled={page >= totalPages}
            className="h-7 w-7 text-ash"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
