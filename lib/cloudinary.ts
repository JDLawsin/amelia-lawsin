import { ALLOWED_TYPES, MAX_FILES, MAX_SIZE } from "@/constants";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImages = async (files: File[], propertyId: string) => {
  if (!files || files.length === 0) return [];

  if (files.length > MAX_FILES) {
    throw new Error("Too many files (max 10)");
  }

  const uploads = files.map(async (file) => {
    if (!file || file.size === 0) return null;

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`Invalid file type: ${file.type}`);
    }

    if (file.size > MAX_SIZE) {
      throw new Error(`File too large: ${file.name}`);
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `properties/${propertyId}`,
              resource_type: "image",
              transformation: [
                { width: 1920, height: 1080, crop: "limit" },
                { quality: "auto:good", fetch_format: "auto" },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(buffer);
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    }
  });

  const results = await Promise.all(uploads);

  return results.filter(Boolean) as { url: string; publicId: string }[];
};

export const deleteImages = async (publicIds: string[]) => {
  if (!publicIds.length) return;

  await cloudinary.api.delete_resources(publicIds);
};

export default cloudinary;
