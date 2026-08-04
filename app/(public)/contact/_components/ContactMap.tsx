"use client";

import MapEmbed from "@/components/ui/MapEmbed";

const ContactMap = () => {
  const query = "Cebu City, Philippines";
  const zoom = 12;

  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;
  const mapsUrl = "https://www.google.com/maps?q=Cebu+City,Philippines";

  return (
    <MapEmbed
      src={embedUrl}
      href={mapsUrl}
      title="Amelia Lawsin Real Estate — Cebu City, Philippines"
      iframeHeight={176}
      containerClassName="h-44 rounded-2xl"
      fallbackLabel={query}
      clickToLoad
    />
  );
};

export default ContactMap;
