"use client";

import VirtualTourEmbed from "@/components/ui/VirtualTourEmbed";
import { parseVirtualTourUrl } from "@/lib/virtual-tour-url";

type PropertyVirtualTourProps = {
  url: string;
  title: string;
};

const PropertyVirtualTour = ({ url, title }: PropertyVirtualTourProps) => {
  const tour = parseVirtualTourUrl(url);
  if (!tour) return null;

  return <VirtualTourEmbed tour={tour} title={title} />;
};

export default PropertyVirtualTour;
