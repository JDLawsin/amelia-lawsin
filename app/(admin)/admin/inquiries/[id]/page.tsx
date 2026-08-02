import { notFound } from "next/navigation";
import { getAdminInquiryById } from "@/services/inquiry.admin.service";
import { markInquiryAsReadAction } from "@/actions/inquiry.action";
import InquiryDetail from "./_components/InquiryDetail";

type Props = {
  params: Promise<{ id: string }>;
};

const InquiryDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const inquiry = await getAdminInquiryById(id);

  if (!inquiry) notFound();

  if (!inquiry.isRead) {
    await markInquiryAsReadAction(id, true);
  }

  const displayInquiry = inquiry.isRead
    ? inquiry
    : { ...inquiry, isRead: true };

  return <InquiryDetail inquiry={displayInquiry} />;
};

export default InquiryDetailPage;
