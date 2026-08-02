"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/auth";
import { ActionResult } from "@/types";
import { InquiryStatus } from "@/app/generated/prisma/browser";

const revalidateInquiryPaths = (id?: string) => {
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");

  if (id) {
    revalidatePath(`/admin/inquiries/${id}`);
  }
};

export const markInquiryAsReadAction = withAdminAuth(
  async (id: string, isRead: boolean): Promise<ActionResult> => {
    if (!id) {
      return { success: false, message: "Inquiry ID is required." };
    }

    try {
      await prisma.inquiry.update({
        where: { id },
        data: { isRead },
      });

      revalidateInquiryPaths(id);

      return {
        success: true,
        message: isRead ? "Marked as read." : "Marked as unread.",
      };
    } catch (error) {
      console.error("Mark inquiry read error:", error);
      return { success: false, message: "Failed to update read status." };
    }
  },
);

export const markInquiryAsRespondedAction = withAdminAuth(
  async (id: string): Promise<ActionResult> => {
    if (!id) {
      return { success: false, message: "Inquiry ID is required." };
    }

    try {
      await prisma.inquiry.update({
        where: { id },
        data: {
          status: InquiryStatus.CONTACTED,
          isRead: true,
          respondedAt: new Date(),
        },
      });

      revalidateInquiryPaths(id);

      return { success: true, message: "Marked as responded." };
    } catch (error) {
      console.error("Mark inquiry responded error:", error);
      return { success: false, message: "Failed to mark as responded." };
    }
  },
);

export const archiveInquiryAction = withAdminAuth(
  async (id: string, isArchived: boolean): Promise<ActionResult> => {
    if (!id) {
      return { success: false, message: "Inquiry ID is required." };
    }

    try {
      await prisma.inquiry.update({
        where: { id },
        data: { isArchived },
      });

      revalidateInquiryPaths(id);

      return {
        success: true,
        message: isArchived ? "Inquiry archived." : "Inquiry unarchived.",
      };
    } catch (error) {
      console.error("Archive inquiry error:", error);
      return { success: false, message: "Failed to update archive status." };
    }
  },
);

export const deleteInquiryAction = withAdminAuth(
  async (id: string): Promise<ActionResult> => {
    if (!id) {
      return { success: false, message: "Inquiry ID is required." };
    }

    try {
      await prisma.inquiry.delete({ where: { id } });

      revalidateInquiryPaths();

      return { success: true, message: "Inquiry deleted." };
    } catch (error) {
      console.error("Delete inquiry error:", error);
      return { success: false, message: "Failed to delete inquiry." };
    }
  },
);

const MAX_NOTES_LENGTH = 5000;

export const updateInquiryNotesAction = withAdminAuth(
  async (id: string, notes: string): Promise<ActionResult> => {
    if (!id) {
      return { success: false, message: "Inquiry ID is required." };
    }

    if (notes.length > MAX_NOTES_LENGTH) {
      return {
        success: false,
        message: `Notes must be less than ${MAX_NOTES_LENGTH} characters.`,
      };
    }

    try {
      await prisma.inquiry.update({
        where: { id },
        data: { notes },
      });

      revalidateInquiryPaths(id);

      return { success: true, message: "Notes saved." };
    } catch (error) {
      console.error("Update inquiry notes error:", error);
      return { success: false, message: "Failed to save notes." };
    }
  },
);
