export const macroCaseToTitleCase = (str: string): string =>
  str
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
