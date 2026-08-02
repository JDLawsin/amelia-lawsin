import { getAdminPropertyBySlug } from "@/services/property.admin.service";
import UpdatePropertyContainer from "./_components/UpdatePropertyContainer";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

const UpdatePropertyPage = async ({ params }: Props) => {
  const { slug } = await params;
  const property = await getAdminPropertyBySlug(slug);

  if (!property) notFound();

  return <UpdatePropertyContainer property={property} />;
};

export default UpdatePropertyPage;
