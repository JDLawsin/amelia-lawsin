"use client";

const ContactMap = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="h-44 bg-cloud rounded-2xl flex items-center justify-center border border-wire">
        <p className="text-xs text-fog">Map unavailable</p>
      </div>
    );
  }

  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Cebu+City,Philippines&zoom=12`;
  const mapsUrl = "https://www.google.com/maps?q=Cebu+City,Philippines";

  return (
    <div className="relative rounded-2xl overflow-hidden border border-wire">
      <iframe
        src={embedUrl}
        width="100%"
        height="176"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Amelia Lawsin Real Estate — Cebu City, Philippines"
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

export default ContactMap;
