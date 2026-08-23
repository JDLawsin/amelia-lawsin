const STORAGE_KEY = "amelia-map-viewed-slugs";
const MAX_VIEWED = 100;

export const getMapViewedSlugs = (): Set<string> => {
  if (typeof window === "undefined") return new Set();

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((s): s is string => typeof s === "string"));
  } catch {
    return new Set();
  }
};

export const markMapPropertyViewed = (slug: string): void => {
  if (typeof window === "undefined" || !slug) return;

  try {
    const viewed = getMapViewedSlugs();
    if (viewed.has(slug)) return;
    viewed.add(slug);
    const slugs = Array.from(viewed).slice(-MAX_VIEWED);
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // Ignore storage errors.
  }
};
