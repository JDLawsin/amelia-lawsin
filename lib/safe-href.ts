export const isSafeHref = (href: string): boolean => {
  const trimmed = href.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith("#") && !trimmed.includes(":")) return true;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;

  try {
    const url = new URL(trimmed);
    return url.protocol === "https:";
  } catch {
    return false;
  }
};
