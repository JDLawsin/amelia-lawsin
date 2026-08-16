import { createQueryString } from "@/lib/utils";

type BlogListParams = {
  tag?: string;
  q?: string;
  page?: string | number;
};

export const blogListUrl = ({
  tag,
  q,
  page,
}: BlogListParams = {}): string => {
  const params: Record<string, string> = {};

  if (tag) params.tag = tag;
  if (q?.trim()) params.q = q.trim();
  if (page && Number(page) > 1) params.page = String(page);

  const query = createQueryString(params);
  return query ? `/blog?${query}` : "/blog";
};
