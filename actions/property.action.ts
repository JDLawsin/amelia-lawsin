"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/auth";
import { ActionResult } from "@/types";

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
