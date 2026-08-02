import imageCompression from "browser-image-compression";

type CompressOptions = {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
};

export const compressImage = async (
  file: File,
  options: CompressOptions = {},
): Promise<File> => {
  const { maxSizeMB = 1, maxWidthOrHeight = 1920 } = options;

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight,
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
