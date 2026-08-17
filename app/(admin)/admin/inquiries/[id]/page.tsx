import { notFound } from "next/navigation";
import {
  getAdminInquiryById,
  markAdminInquiryAsRead,
} from "@/services/inquiry.admin.service";
import InquiryDetail from "./_components/InquiryDetail";

type Props = {
  params: Promise<{ id: string }>;
};

const InquiryDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const inquiry = await getAdminInquiryById(id);

  if (!inquiry) notFound();

  const wasUnread = !inquiry.isRead;

  if (wasUnread) {
    await markAdminInquiryAsRead(id);
  }

  const displayInquiry = wasUnread ? { ...inquiry, isRead: true } : inquiry;

  return (
    <InquiryDetail inquiry={displayInquiry} refreshCaches={wasUnread} />
  );
};

export default InquiryDetailPage;
