"use client";

type PropertyMapProps = {
  latitude: number;
  longitude: number;
  title: string;
};

const PropertyMap = ({ latitude, longitude, title }: PropertyMapProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const zoom = 15;

  if (!apiKey) {
    return (
      <div className="h-52 bg-cloud rounded-xl flex items-center justify-center">
        <p className="text-xs text-fog">
          Map unavailable — API key not configured
        </p>
      </div>
    );
  }

  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=${zoom}`;
  const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <div className="relative rounded-xl overflow-hidden border border-wire">
      <iframe
        src={embedUrl}
        width="100%"
        height="220"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map showing location of ${title}`}
      />
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 bg-white text-ink text-xs font-medium px-3 py-1.5 rounded-lg border border-wire shadow-apple-sm hover:shadow-apple transition-shadow"
      >
        Open in Maps →
      </a>
    </div>
  );
};

export default PropertyMap;
