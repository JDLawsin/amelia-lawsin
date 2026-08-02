import { getImageProps } from "next/image";
import { preload } from "react-dom";

type PreloadLcpImageOptions = {
  width: number;
  height: number;
  sizes?: string;
};

/** Preload the same optimized URL Next.js `<Image priority />` will request. */
export const preloadLcpImage = (
  src: string,
  alt: string,
  { width, height, sizes }: PreloadLcpImageOptions,
) => {
  const { props } = getImageProps({
    src,
    alt,
    width,
    height,
    sizes,
    priority: true,
  });

  preload(props.src, { as: "image", fetchPriority: "high" });
};
