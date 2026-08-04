"use client";

import MapEmbed from "@/components/ui/MapEmbed";

type PropertyMapProps = {
  latitude: number;
  longitude: number;
  title: string;
};

const PropertyMap = ({ latitude, longitude, title }: PropertyMapProps) => {
  const zoom = 15;

  const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=${zoom}&output=embed`;
  const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <MapEmbed
      src={embedUrl}
      href={mapsUrl}
      title={`Map showing location of ${title}`}
      iframeHeight={220}
      containerClassName="h-52 rounded-xl"
      fallbackLabel={title}
    />
  );
};

export default PropertyMap;
