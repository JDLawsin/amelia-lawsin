import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createQueryString } from "@/lib/utils";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  activeTag?: string;
  label?: string;
};

const buildPageUrl = (page: number, activeTag?: string) => {
  const params: Record<string, string> = { page: String(page) };
  if (activeTag) params.tag = activeTag;
  return `/blog?${createQueryString(params)}`;
};

/** Server-rendered pagination — no client JS. */
const BlogPagination = ({
  page,
  pageSize,
  total,
  activeTag,
  label = "articles",
}: Props) => {
  const totalPages = Math.ceil(total / pageSize);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  if (total === 0) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(
      (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
    )
    .reduce<(number | "...")[]>((acc, p, i, arr) => {
      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  const navButtonClass =
    "inline-flex h-7 w-7 items-center justify-center rounded-md text-ash hover:bg-cloud transition-colors disabled:opacity-40 disabled:pointer-events-none";

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-wire bg-cloud/50">
      <p className="text-xs text-ash">
        Showing{" "}
        <span className="font-medium text-ink">
          {from}–{to}
        </span>{" "}
        of <span className="font-medium text-ink">{total}</span> {label}
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {page <= 1 ? (
            <span className={navButtonClass} aria-disabled="true">
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </span>
          ) : (
            <Link
              href={buildPageUrl(page - 1, activeTag)}
              className={navButtonClass}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </Link>
          )}

          {pageNumbers.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="text-xs text-ash px-1">
                …
              </span>
            ) : (
              <Link
                key={p}
                href={buildPageUrl(p as number, activeTag)}
                aria-label={`Go to page ${p}`}
                aria-current={page === p ? "page" : undefined}
                className={
                  page === p
                    ? "inline-flex h-7 w-7 items-center justify-center rounded-md bg-ink text-white text-xs hover:bg-ink/90"
                    : "inline-flex h-7 w-7 items-center justify-center rounded-md text-xs text-ash hover:bg-cloud"
                }
              >
                {p}
              </Link>
            ),
          )}

          {page >= totalPages ? (
            <span className={navButtonClass} aria-disabled="true">
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </span>
          ) : (
            <Link
              href={buildPageUrl(page + 1, activeTag)}
              className={navButtonClass}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogPagination;
