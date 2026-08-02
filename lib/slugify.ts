export const defaultSlugify = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const slugifyTagName = (name: string): string =>
  defaultSlugify(name).replace(/[^a-z0-9-]/g, "");
