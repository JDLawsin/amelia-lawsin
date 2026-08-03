import { getImageProps } from "next/image";
import { preload } from "react-dom";

type PreloadLcpImageOptions = {
  width: number;
  height: number;
  sizes?: string;
};

type LcpImageAttrs = {
  src: string;
  srcSet?: string;
  sizes?: string;
};

const getOptimizedImageAttrs = (
  src: string,
  alt: string,
  { width, height, sizes }: PreloadLcpImageOptions,
): LcpImageAttrs => {
  const { props } = getImageProps({
    src,
    alt,
    width,
    height,
    sizes,
    priority: true,
  });

  return {
    src: props.src,
    srcSet: props.srcSet,
    sizes: props.sizes,
  };
};

/** Preload the same optimized URL Next.js `<Image priority />` will request. */
export const preloadLcpImage = (
  src: string,
  alt: string,
  options: PreloadLcpImageOptions,
) => {
  const attrs = getOptimizedImageAttrs(src, alt, options);

  preload(attrs.src, {
    as: "image",
    fetchPriority: "high",
    imageSrcSet: attrs.srcSet,
    imageSizes: attrs.sizes,
  });

  return attrs;
};

/** Renders a media-scoped image preload link (hoisted to `<head>` by React). */
export const LcpPreloadLink = ({
  src,
  alt,
  width,
  height,
  sizes,
  media,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  media: string;
}) => {
  const attrs = getOptimizedImageAttrs(src, alt, { width, height, sizes });

  return (
    <link
      rel="preload"
      as="image"
      href={attrs.srcSet ? undefined : attrs.src}
      imageSrcSet={attrs.srcSet}
      imageSizes={attrs.sizes}
      media={media}
      fetchPriority="high"
    />
  );
};
