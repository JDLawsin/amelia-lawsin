import Image from "next/image";
import { SITE_CONFIG } from "@/constants";
import { cloudinaryDeliveryUrl } from "@/lib/cloudinary-url";
import { PROPERTY_GALLERY_PRIMARY_WIDTH } from "@/lib/image-layout";

export type PropertyFactSheetPrintProps = {
  title: string;
  shareUrl: string;
  price: string;
  priceNote?: string;
  address: string;
  statusLabel: string;
  typeLabel: string;
  listingTypeLabel: string;
  description: string;
  imageUrl?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  floorArea?: number | null;
  lotArea?: number | null;
  parking?: number | null;
  amenities: string[];
};

const SpecItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="border border-black/15 rounded-lg px-3 py-2 text-center">
    <p className="text-sm font-medium text-black">{value}</p>
    <p className="text-[10px] text-black/60 mt-0.5">{label}</p>
  </div>
);

const PropertyFactSheetPrint = ({
  title,
  shareUrl,
  price,
  priceNote,
  address,
  statusLabel,
  typeLabel,
  listingTypeLabel,
  description,
  imageUrl,
  bedrooms,
  bathrooms,
  floorArea,
  lotArea,
  parking,
  amenities,
}: PropertyFactSheetPrintProps) => {
  const printImageSrc = cloudinaryDeliveryUrl(imageUrl, {
    width: PROPERTY_GALLERY_PRIMARY_WIDTH,
    quality: "auto:best",
  });

  const specs = [
    bedrooms != null && {
      label: bedrooms === 0 ? "Studio" : "Bedrooms",
      value: bedrooms === 0 ? "Studio" : String(bedrooms),
    },
    bathrooms != null && {
      label: "Bathrooms",
      value: String(bathrooms),
    },
    floorArea != null && {
      label: "Floor area",
      value: `${floorArea} sqm`,
    },
    lotArea != null &&
      floorArea == null && {
        label: "Lot area",
        value: `${lotArea} sqm`,
      },
    parking != null && {
      label: "Parking",
      value: String(parking),
    },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <section
      aria-hidden="true"
      className="hidden print:block bg-white text-black"
    >
      <div className="max-w-[18cm] mx-auto py-4">
        <header className="flex items-start justify-between gap-4 border-b border-black/15 pb-4 mb-4">
          <div>
            <p className="text-lg font-serif font-medium">{SITE_CONFIG.name}</p>
            <p className="text-xs text-black/60">
              Licensed Real Estate Agent · PRC Lic. No.{" "}
              {SITE_CONFIG.prcLicenseNo}
            </p>
            <p className="text-xs text-black/60">{SITE_CONFIG.location}</p>
          </div>
          <div className="text-right text-xs text-black/60">
            <p>{SITE_CONFIG.phone}</p>
            <p>{SITE_CONFIG.email}</p>
          </div>
        </header>

        {printImageSrc && (
          <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg border border-black/10">
            <Image
              src={printImageSrc}
              alt={title}
              fill
              sizes="18cm"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-widest text-black/50 mb-1">
            Property fact sheet
          </p>
          <h1 className="text-2xl font-serif font-medium leading-tight mb-2">
            {title}
          </h1>
          {address && (
            <p className="text-sm text-black/70 mb-3">{address}</p>
          )}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-[10px] font-medium px-2 py-1 rounded-full border border-black/15">
              {statusLabel}
            </span>
            <span className="text-[10px] font-medium px-2 py-1 rounded-full border border-black/15">
              {typeLabel}
            </span>
            <span className="text-[10px] font-medium px-2 py-1 rounded-full border border-black/15">
              {listingTypeLabel}
            </span>
          </div>
          <p className="text-2xl font-serif font-medium">
            {price}
            {priceNote ? (
              <span className="text-sm text-black/60 ml-2">{priceNote}</span>
            ) : null}
          </p>
        </div>

        {specs.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {specs.map((spec) => (
              <SpecItem key={spec.label} label={spec.label} value={spec.value} />
            ))}
          </div>
        )}

        <div className="mb-4">
          <h2 className="text-sm font-medium mb-2">About this property</h2>
          <p className="text-sm leading-relaxed text-black/80 whitespace-pre-line">
            {description}
          </p>
        </div>

        {amenities.length > 0 && (
          <div className="mb-4">
            <h2 className="text-sm font-medium mb-2">Amenities</h2>
            <ul className="grid grid-cols-2 gap-1 text-sm text-black/80">
              {amenities.map((amenity) => (
                <li key={amenity}>• {amenity}</li>
              ))}
            </ul>
          </div>
        )}

        <footer className="border-t border-black/15 pt-4 text-xs text-black/70">
          <p className="font-medium text-black mb-1">Contact {SITE_CONFIG.name}</p>
          <p>Phone / Viber: {SITE_CONFIG.phone}</p>
          <p>Email: {SITE_CONFIG.email}</p>
          <p>Messenger: {SITE_CONFIG.messengerUrl.replace("https://", "")}</p>
          <p className="mt-2 break-all">Listing: {shareUrl}</p>
          <p className="mt-3 text-[10px] text-black/50 leading-relaxed">
            Information is subject to change without notice. Verify details with
            {` ${SITE_CONFIG.name} `}
            before making any decision.
          </p>
        </footer>
      </div>
    </section>
  );
};

export default PropertyFactSheetPrint;
