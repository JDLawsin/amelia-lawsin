import imageCompression from "browser-image-compression";

export type CompressPreset = "property" | "blog" | "floorPlan";

type CompressOptions = {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  initialQuality?: number;
  preset?: CompressPreset;
};

const PRESETS: Record<
  CompressPreset,
  Required<Pick<CompressOptions, "maxSizeMB" | "maxWidthOrHeight" | "initialQuality">>
> = {
  property: {
    maxWidthOrHeight: 2048,
    maxSizeMB: 2.5,
    initialQuality: 0.85,
  },
  blog: {
    maxWidthOrHeight: 1920,
    maxSizeMB: 1.5,
    initialQuality: 0.85,
  },
  floorPlan: {
    maxWidthOrHeight: 1920,
    maxSizeMB: 1.5,
    initialQuality: 0.85,
  },
};

export const compressImage = async (
  file: File,
  options: CompressOptions = {},
): Promise<File> => {
  const preset = options.preset ? PRESETS[options.preset] : null;
  const maxSizeMB = options.maxSizeMB ?? preset?.maxSizeMB ?? 2.5;
  const maxWidthOrHeight =
    options.maxWidthOrHeight ?? preset?.maxWidthOrHeight ?? 2048;
  const initialQuality =
    options.initialQuality ?? preset?.initialQuality ?? 0.85;

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight,
      initialQuality,
      useWebWorker: true,
      preserveExif: false,
    });

    return compressed;
  } catch (error) {
    console.error("Image compression failed:", error);

    // Return the original file if compression fails; the server-side
    // Cloudinary upload still applies its own size/format limits.
    return file;
  }
};
