export type CloudinaryDeliveryQuality = "auto" | "auto:best" | number;

type DeliveryOptions = {
  width?: number;
  quality?: CloudinaryDeliveryQuality;
};

/**
 * Inject Cloudinary delivery transforms so cards can request smaller
 * sources while gallery/lightbox keep high-res + q_auto:best.
 */
export const cloudinaryDeliveryUrl = (
  url: string | null | undefined,
  options: DeliveryOptions = {},
): string | null => {
  if (!url) return null;

  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  // Avoid stacking transforms on URLs that already request auto format
  if (url.includes("f_auto")) {
    return url;
  }

  const { width, quality = "auto:best" } = options;
  const qParam =
    typeof quality === "number" ? `q_${quality}` : `q_${quality}`;

  const parts = ["f_auto", qParam, "c_limit"];
  if (width != null && width > 0) {
    parts.push(`w_${Math.round(width)}`);
  }

  return url.replace("/upload/", `/upload/${parts.join(",")}/`);
};
