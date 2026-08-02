"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/auth";
import { ActionResult } from "@/types";
import { FullPropertySchema } from "@/app/(admin)/admin/properties/_schema/property.schema";
import { FieldErrors } from "react-hook-form";
import { deleteImages, uploadImages, uploadSingleImage } from "@/lib/cloudinary";
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

type UploadedAsset = { url: string; publicId: string };

type ImageItemInput = {
  id?: string;
  caption?: string;
  order: number;
  isPrimary: boolean;
};

const parseJSON = (value: FormDataEntryValue | null) => {
  if (!value || typeof value !== "string") return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
};

const extractFloorPlanFiles = (formData: FormData): Map<number, File> => {
  const map = new Map<number, File>();

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("floorPlanFiles_") && value instanceof File) {
      const index = Number(key.replace("floorPlanFiles_", ""));
      if (!Number.isNaN(index)) {
        map.set(index, value);
      }
    }
  }

  return map;
};

const uploadFloorPlanImages = async (
  units: { floorPlanImage?: string | null; floorPlanPublicId?: string | null }[],
  floorPlanFiles: Map<number, File>,
  propertyId: string,
  uploadedAssets: UploadedAsset[],
): Promise<
  Array<{ floorPlanImage?: string; floorPlanPublicId?: string } | undefined>
> => {
  return Promise.all(
    units.map(async (unit, index) => {
      const file = floorPlanFiles.get(index);
      if (!file) return undefined;

      const uploaded = await uploadSingleImage(
        file,
        `properties/${propertyId}/units`,
      );

      if (!uploaded) return undefined;

      uploadedAssets.push(uploaded);

      return {
        floorPlanImage: uploaded.url,
        floorPlanPublicId: uploaded.publicId,
      };
    }),
  );
};

export const createPropertyAction = withAdminAuth(
  async (_, formData: FormData): Promise<FormState> => {
    const uploadedAssets: UploadedAsset[] = [];

    try {
      const imageFiles = (formData.getAll("imageFiles") as File[]).filter(
        (file) => file && file.size > 0,
      );
      const imageItems = (parseJSON(formData.get("imageItems")) ??
        []) as ImageItemInput[];
      const floorPlanFiles = extractFloorPlanFiles(formData);

      const rawData = {
        ...Object.fromEntries(formData.entries()),
        units: parseJSON(formData.get("units")) ?? [],
        amenities: parseJSON(formData.get("amenities")) ?? [],
        paymentSchemes: parseJSON(formData.get("paymentSchemes")) ?? [],
        landmarks: parseJSON(formData.get("landmarks")) ?? [],
        imageItems,
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

      const propertyId = randomUUID();

      let uploadedResults: Awaited<ReturnType<typeof uploadImages>> = [];
      if (imageFiles.length > 0) {
        uploadedResults = await uploadImages(imageFiles, propertyId);
        uploadedAssets.push(
          ...uploadedResults.filter(
            (result): result is { url: string; publicId: string } =>
              result !== null,
          ),
        );
      }

      const newImageItems = imageItems.filter((item) => !item.id);
      const hasPrimary = newImageItems.some((item) => item.isPrimary);

      const imagesWithFiles = newImageItems
        .map((item, index) => ({
          ...item,
          uploaded: uploadedResults[index] ?? null,
        }))
        .filter(
          (
            item,
          ): item is typeof item & {
            uploaded: { url: string; publicId: string };
          } => item.uploaded !== null,
        );

      const floorPlanUpdates = await uploadFloorPlanImages(
        data.units,
        floorPlanFiles,
        propertyId,
        uploadedAssets,
      );

      const unitsWithFloorPlans = data.units.map((unit, index) => ({
        ...mapUnit(unit),
        ...(floorPlanUpdates[index] ?? {}),
      }));

      const [amenityConnections, landmarkConnections, schemeConnections] =
        await Promise.all([
          processAmenities(data.amenities),
          processLandmarks(data.landmarks),
          processPaymentSchemes(data.paymentSchemes),
        ]);

      const property = await prisma.property.create({
        data: {
          id: propertyId,
          ...mapPropertyData(data),

          images:
            imagesWithFiles.length > 0
              ? {
                  create: imagesWithFiles.map((item, index) => ({
                    url: item.uploaded.url,
                    publicId: item.uploaded.publicId,
                    caption: item.caption,
                    order: item.order,
                    isPrimary:
                      item.isPrimary || (!hasPrimary && index === 0),
                  })),
                }
              : undefined,

          units: {
            create: unitsWithFloorPlans,
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
        message: `Property created successfully with ${imagesWithFiles.length} images!`,
      };
    } catch (error) {
      console.error("Create property error:", error);

      if (uploadedAssets.length) {
        await deleteImages(uploadedAssets.map((img) => img.publicId));
      }

      return {
        success: false,
        message: "Failed to create property. Please try again.",
      };
    }
  },
);

const ensurePrimaryImage = async (propertyId: string) => {
  const primaryCount = await prisma.propertyImage.count({
    where: { propertyId, isPrimary: true },
  });

  if (primaryCount > 0) return;

  const firstImage = await prisma.propertyImage.findFirst({
    where: { propertyId },
    orderBy: { order: "asc" },
    select: { id: true },
  });

  if (!firstImage) return;

  await prisma.propertyImage.update({
    where: { id: firstImage.id },
    data: { isPrimary: true },
  });
};

export const updatePropertyAction = withAdminAuth(
  async (_, formData: FormData): Promise<FormState> => {
    const uploadedAssets: UploadedAsset[] = [];

    try {
      const propertyId = formData.get("id") as string;

      const deletedImageIdsRaw = formData.get("deletedImageIds");
      const imageFiles = (formData.getAll("imageFiles") as File[]).filter(
        (file) => file && file.size > 0,
      );
      const imageItems = (parseJSON(formData.get("imageItems")) ??
        []) as ImageItemInput[];
      const floorPlanFiles = extractFloorPlanFiles(formData);

      const rawData = {
        ...Object.fromEntries(formData.entries()),
        units: parseJSON(formData.get("units")) ?? [],
        amenities: parseJSON(formData.get("amenities")) ?? [],
        paymentSchemes: parseJSON(formData.get("paymentSchemes")) ?? [],
        landmarks: parseJSON(formData.get("landmarks")) ?? [],
        imageItems,
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

      const [amenityConnections, landmarkConnections, schemeConnections] =
        await Promise.all([
          processAmenities(data.amenities),
          processLandmarks(data.landmarks),
          processPaymentSchemes(data.paymentSchemes),
        ]);

      // Capture old floor-plan public IDs before recreating units
      const oldUnits = await prisma.propertyUnit.findMany({
        where: { propertyId },
        select: { floorPlanPublicId: true },
      });
      const oldFloorPlanPublicIds = oldUnits
        .map((u) => u.floorPlanPublicId)
        .filter(Boolean) as string[];

      // Handle deleted existing images
      let deletedPublicIds: string[] = [];
      let deletedIds: string[] = [];
      if (deletedImageIdsRaw) {
        deletedIds = JSON.parse(deletedImageIdsRaw as string) as string[];
      } else {
        const existingImages = await prisma.propertyImage.findMany({
          where: { propertyId },
          select: { id: true },
        });
        const submittedIds = new Set(
          imageItems
            .map((item) => item.id)
            .filter((id): id is string => Boolean(id)),
        );
        deletedIds = existingImages
          .map((image) => image.id)
          .filter((id) => !submittedIds.has(id));
      }

      if (deletedIds.length > 0) {
        const imagesToDelete = await prisma.propertyImage.findMany({
          where: { id: { in: deletedIds }, propertyId },
          select: { publicId: true },
        });

        deletedPublicIds = imagesToDelete.map((img) => img.publicId);

        await prisma.propertyImage.deleteMany({
          where: { id: { in: deletedIds }, propertyId },
        });
      }

      // Update existing image metadata (caption/order/primary)
      const existingImageItems = imageItems.filter((item) => item.id);
      for (const item of existingImageItems) {
        await prisma.propertyImage.update({
          where: { id: item.id, propertyId },
          data: {
            caption: item.caption ?? null,
            order: item.order,
            isPrimary: item.isPrimary,
          },
        });
      }

      // Upload new main images
      if (imageFiles.length > 0) {
        const uploadedResults = await uploadImages(imageFiles, propertyId);
        uploadedAssets.push(
          ...uploadedResults.filter(
            (result): result is { url: string; publicId: string } =>
              result !== null,
          ),
        );

        const newImageItems = imageItems.filter((item) => !item.id);
        const createData = newImageItems
          .map((item, index) => {
            const uploaded = uploadedResults[index];
            if (!uploaded) return null;
            return {
              propertyId,
              url: uploaded.url,
              publicId: uploaded.publicId,
              caption: item.caption ?? null,
              order: item.order,
              isPrimary: item.isPrimary,
            };
          })
          .filter(Boolean) as {
          propertyId: string;
          url: string;
          publicId: string;
          caption: string | null;
          order: number;
          isPrimary: boolean;
        }[];

        if (createData.length > 0) {
          await prisma.propertyImage.createMany({ data: createData });
        }
      }

      // Upload new unit floor plans
      const floorPlanUpdates = await uploadFloorPlanImages(
        data.units,
        floorPlanFiles,
        propertyId,
        uploadedAssets,
      );

      const unitsWithFloorPlans = data.units.map((unit, index) => ({
        ...mapUnit(unit),
        ...(floorPlanUpdates[index] ?? {}),
      }));

      // Update property and recreate relations
      await prisma.property.update({
        where: { id: propertyId },
        data: {
          ...mapPropertyData(data),

          units: {
            deleteMany: {},
            create: unitsWithFloorPlans,
          },

          amenities: {
            deleteMany: {},
            create: amenityConnections.map((conn) => ({
              ...("amenityId" in conn
                ? { amenity: { connect: { id: conn.amenityId } } }
                : { amenity: conn.amenity }),
            })),
          },

          landmarks: {
            deleteMany: {},
            create: landmarkConnections.map((conn) => ({
              distance: conn.distance,
              ...("landmarkId" in conn
                ? { landmark: { connect: { id: conn.landmarkId } } }
                : { landmark: conn.landmark }),
            })),
          },

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

      // Delete replaced floor-plan Cloudinary assets
      const newFloorPlanPublicIds = new Set(
        unitsWithFloorPlans
          .map((u) => u.floorPlanPublicId)
          .filter(Boolean) as string[],
      );
      const replacedFloorPlanIds = oldFloorPlanPublicIds.filter(
        (id) => !newFloorPlanPublicIds.has(id),
      );

      const cloudinaryPublicIdsToDelete = [
        ...deletedPublicIds,
        ...replacedFloorPlanIds,
      ];

      if (cloudinaryPublicIdsToDelete.length > 0) {
        await deleteImages(cloudinaryPublicIdsToDelete);
      }

      await ensurePrimaryImage(propertyId);

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

      if (uploadedAssets.length) {
        await deleteImages(uploadedAssets.map((img) => img.publicId));
      }

      return {
        success: false,
        message: "Failed to update property. Please try again.",
      };
    }
  },
);
