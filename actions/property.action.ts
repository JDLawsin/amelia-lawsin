"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/auth";
import { ActionResult } from "@/types";
import { FullPropertySchema } from "@/app/(admin)/admin/properties/_schema/property.schema";
import { FieldErrors } from "react-hook-form";
import { deleteImages, uploadImages } from "@/lib/cloudinary";
import { mapPropertyData, mapUnit } from "@/lib/mapper";
import { randomUUID } from "crypto";
import {
  processAmenities,
  processLandmarks,
  processPaymentSchemes,
} from "@/lib/property-helpers";

export const toggleFeaturedAction = withAdminAuth(
  async (id: string, isFeatured: boolean): Promise<ActionResult> => {
    try {
      await prisma.property.update({
        where: { id },
        data: { isFeatured: !isFeatured },
      });

      revalidatePath("/admin/properties");
      revalidatePath("/");

      return {
        success: true,
        message: isFeatured ? "Removed from featured" : "Marked as featured",
      };
    } catch (error) {
      console.error("Toggle property featured error:", error);
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  },
);

export const deletePropertyAction = withAdminAuth(
  async (id: string): Promise<ActionResult> => {
    try {
      await prisma.property.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      revalidatePath("/admin/properties");
      revalidatePath("/properties");

      return { success: true, message: "Property deleted" };
    } catch {
      return { success: false, message: "Failed to delete. Please try again." };
    }
  },
);

export type FormState =
  | {
      success: true;
      message: string;
      slug: string;
      errors?: never;
    }
  | {
      success: false;
      message: string;
      errors?: FieldErrors;
      slug?: never;
    }
  | null;

export const createPropertyAction = withAdminAuth(
  async (_, formData: FormData): Promise<FormState> => {
    let uploadedImages: { url: string; publicId: string }[] = [];

    try {
      // 1. Extract files
      const imageFiles = (formData.getAll("images") as File[]).filter(
        (file) => file && file.size > 0,
      );

      // 2. Parse JSON fields
      const parseJSON = (value: FormDataEntryValue | null) => {
        if (!value || typeof value !== "string") return undefined;
        try {
          return JSON.parse(value);
        } catch {
          return undefined;
        }
      };

      const rawData = {
        ...Object.fromEntries(formData.entries()),
        units: parseJSON(formData.get("units")) ?? [],
        amenities: parseJSON(formData.get("amenities")) ?? [],
        paymentSchemes: parseJSON(formData.get("paymentSchemes")) ?? [],
        landmarks: parseJSON(formData.get("landmarks")) ?? [],
        images: [],
      };

      // 3. Validate with Zod
      const result = FullPropertySchema.safeParse(rawData);

      if (!result.success) {
        const fieldErrors: FieldErrors = {};
        const flatErrors = result.error.flatten().fieldErrors;

        for (const [field, messages] of Object.entries(flatErrors)) {
          if (messages && messages.length > 0) {
            fieldErrors[field] = { type: "manual", message: messages[0] };
          }
        }

        return {
          success: false,
          errors: fieldErrors,
          message: "Validation failed. Please check the form.",
        };
      }

      const data = result.data;

      // 4. Upload images
      const propertyId = randomUUID();
      if (imageFiles && imageFiles.length > 0) {
        uploadedImages = await uploadImages(imageFiles, propertyId);
      }

      // 5. Process lookup data (find or create)
      const [amenityConnections, landmarkConnections, schemeConnections] =
        await Promise.all([
          processAmenities(data.amenities),
          processLandmarks(data.landmarks),
          processPaymentSchemes(data.paymentSchemes),
        ]);

      // 6. Create property with all relations
      const property = await prisma.property.create({
        data: {
          id: propertyId,
          ...mapPropertyData(data),

          images:
            uploadedImages.length > 0
              ? {
                  create: uploadedImages.map((img, index) => ({
                    url: img.url,
                    publicId: img.publicId,
                    order: index,
                    isPrimary: index === 0,
                  })),
                }
              : undefined,

          units: {
            create: data.units.map(mapUnit),
          },

          amenities: {
            create: amenityConnections.map((conn) => ({
              ...("amenityId" in conn
                ? { amenity: { connect: { id: conn.amenityId } } }
                : { amenity: conn.amenity }),
            })),
          },

          landmarks: {
            create: landmarkConnections.map((conn) => ({
              distance: conn.distance,
              ...("landmarkId" in conn
                ? { landmark: { connect: { id: conn.landmarkId } } }
                : { landmark: conn.landmark }),
            })),
          },

          paymentSchemes: {
            create: schemeConnections.map((conn) => ({
              ...("paymentSchemeId" in conn
                ? { paymentScheme: { connect: { id: conn.paymentSchemeId } } }
                : { paymentScheme: conn.paymentScheme }),
            })),
          },
        },
        select: {
          slug: true,
        },
      });

      revalidatePath("/properties");
      revalidatePath("/admin/properties");

      return {
        success: true,
        slug: property.slug,
        message: `Property created successfully with ${uploadedImages.length} images!`,
      };
    } catch (error) {
      console.error("Create property error:", error);

      if (uploadedImages.length) {
        await deleteImages(uploadedImages.map((img) => img.publicId));
      }

      return {
        success: false,
        message: "Failed to create property. Please try again.",
      };
    }
  },
);

export const updatePropertyAction = withAdminAuth(
  async (_, formData: FormData): Promise<FormState> => {
    let uploadedImages: { url: string; publicId: string }[] = [];

    try {
      const propertyId = formData.get("id") as string;

      // 1. Handle deleted images
      const deletedImageIds = formData.get("deletedImageIds");
      if (deletedImageIds) {
        const ids = JSON.parse(deletedImageIds as string) as string[];

        const imagesToDelete = await prisma.propertyImage.findMany({
          where: { id: { in: ids } },
          select: { publicId: true },
        });

        await deleteImages(imagesToDelete.map((img) => img.publicId));

        await prisma.propertyImage.deleteMany({
          where: { id: { in: ids } },
        });
      }

      // 2. Handle new image uploads
      const imageFiles = (formData.getAll("images") as File[]).filter(
        (file) => file && file.size > 0,
      );

      if (imageFiles.length > 0) {
        uploadedImages = await uploadImages(imageFiles, propertyId);

        const maxOrder = await prisma.propertyImage.findFirst({
          where: { propertyId },
          orderBy: { order: "desc" },
          select: { order: true },
        });

        const startOrder = (maxOrder?.order ?? -1) + 1;

        await prisma.propertyImage.createMany({
          data: uploadedImages.map((img, index) => ({
            propertyId,
            url: img.url,
            publicId: img.publicId,
            order: startOrder + index,
            isPrimary: false,
          })),
        });
      }

      // 3. Parse and validate other fields
      const parseJSON = (value: FormDataEntryValue | null) => {
        if (!value || typeof value !== "string") return undefined;
        try {
          return JSON.parse(value);
        } catch {
          return undefined;
        }
      };

      const rawData = {
        ...Object.fromEntries(formData.entries()),
        units: parseJSON(formData.get("units")) ?? [],
        amenities: parseJSON(formData.get("amenities")) ?? [],
        paymentSchemes: parseJSON(formData.get("paymentSchemes")) ?? [],
        landmarks: parseJSON(formData.get("landmarks")) ?? [],
        images: [],
        id: undefined,
        deletedImageIds: undefined,
      };

      const result = FullPropertySchema.safeParse(rawData);

      if (!result.success) {
        const fieldErrors: FieldErrors = {};
        const flatErrors = result.error.flatten().fieldErrors;

        for (const [field, messages] of Object.entries(flatErrors)) {
          if (messages && messages.length > 0) {
            fieldErrors[field] = { type: "manual", message: messages[0] };
          }
        }
        return {
          success: false,
          errors: fieldErrors,
          message: "Validation failed. Please check the form.",
        };
      }

      const data = result.data;

      // 4. Process lookup data
      const [amenityConnections, landmarkConnections, schemeConnections] =
        await Promise.all([
          processAmenities(data.amenities),
          processLandmarks(data.landmarks),
          processPaymentSchemes(data.paymentSchemes),
        ]);

      // 5. Update property with cascade deletes
      await prisma.property.update({
        where: { id: propertyId },
        data: {
          ...mapPropertyData(data),

          // Delete and recreate units
          units: {
            deleteMany: {},
            create: data.units.map(mapUnit),
          },

          // Delete and recreate amenities
          amenities: {
            deleteMany: {},
            create: amenityConnections.map((conn) => ({
              ...("amenityId" in conn
                ? { amenity: { connect: { id: conn.amenityId } } }
                : { amenity: conn.amenity }),
            })),
          },

          // Delete and recreate landmarks
          landmarks: {
            deleteMany: {},
            create: landmarkConnections.map((conn) => ({
              distance: conn.distance,
              ...("landmarkId" in conn
                ? { landmark: { connect: { id: conn.landmarkId } } }
                : { landmark: conn.landmark }),
            })),
          },

          // Delete and recreate payment schemes
          paymentSchemes: {
            deleteMany: {},
            create: schemeConnections.map((conn) => ({
              ...("paymentSchemeId" in conn
                ? { paymentScheme: { connect: { id: conn.paymentSchemeId } } }
                : { paymentScheme: conn.paymentScheme }),
            })),
          },
        },
      });

      revalidatePath("/properties");
      revalidatePath(`/properties/${data.slug}`);
      revalidatePath("/admin/properties");

      return {
        success: true,
        slug: data.slug,
        message: `Property updated successfully!`,
      };
    } catch (error) {
      console.error("Update property error:", error);

      if (uploadedImages.length) {
        await deleteImages(uploadedImages.map((img) => img.publicId));
      }

      return {
        success: false,
        message: "Failed to update property. Please try again.",
      };
    }
  },
);
