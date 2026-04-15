"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/auth";
import { ActionResult, Nullable } from "@/types";
import { FullPropertySchema } from "@/app/(admin)/admin/properties/_schema/property.schema";
import { FieldErrors } from "react-hook-form";
import cloudinary, { uploadImages } from "@/lib/cloudinary";
import { Readable } from "stream";
import {
  mapAmenity,
  mapLandmark,
  mapPaymentScheme,
  mapPropertyData,
  mapUnit,
} from "@/lib/mapper";

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
    try {
      // 1. Extract files
      const imageFiles = formData.getAll("images") as File[];

      // 2. Parse JSON fields safely
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

      //3. Validate with Zod
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

      // 4. Upload images to Cloudinary
      const uploadedImages = await uploadImages(imageFiles);

      // 5. Create property (clean mapping)
      const property = await prisma.property.create({
        data: {
          ...mapPropertyData(data),

          images: {
            create: uploadedImages.map((img, index) => ({
              url: img.url,
              publicId: img.publicId,
              order: index,
              isPrimary: index === 0,
            })),
          },

          units: {
            create: data.units.map(mapUnit),
          },

          amenities: {
            create: data.amenities.map(mapAmenity),
          },

          paymentSchemes: {
            create: data.paymentSchemes.map(mapPaymentScheme),
          },

          landmarks: {
            create: data.landmarks.map(mapLandmark),
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

      return {
        success: false,
        message: "Failed to create property. Please try again.",
      };
    }
  },
);
