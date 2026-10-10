import { revalidatePath } from "next/cache";

export const revalidateInquiryPaths = (id?: string) => {
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");

  if (id) {
    revalidatePath(`/admin/inquiries/${id}`);
  }
};
