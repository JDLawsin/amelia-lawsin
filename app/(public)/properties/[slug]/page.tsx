import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin } from "lucide-react";
import clsx from "clsx";
import type { Metadata } from "next";

import {
  PropertyAmenity,
  PropertyLandmark,
  PropertyPaymentScheme,
} from "@/app/generated/prisma/browser";
import {
  getPropertyBySlug,
  getRelatedProperties,
} from "@/services/property.service";
import { STATUS_LABELS, STATUS_STYLES } from "@/constants";
import { formatPriceWithNote } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) return { title: "Property not found" };

  const price = property.priceLabel
    ? property.priceLabel
    : property.price
      ? `₱${property.price.toLocaleString()}`
      : null;

  const specs = [
    property.bedrooms != null &&
      (property.bedrooms === 0 ? "Studio" : `${property.bedrooms}BR`),
    property.floorArea && `${property.floorArea}sqm`,
    property.city,
  ]
    .filter(Boolean)
    .join(" · ");

  const statusLabel: Record<string, string> = {
    FOR_SALE: "For Sale",
    FOR_RENT: "For Rent",
    PRE_SELLING: "Pre-selling",
  };

  const title = `${property.title} ${statusLabel[property.status] ?? ""} | Amelia Lawsin`;

  const description = [
    price,
    specs,
    property.address,
    property.description.slice(0, 120),
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: property.images[0]?.url
        ? [{ url: property.images[0].url, alt: property.title }]
        : [],
      type: "website",
    },
    alternates: {
      canonical: `/properties/${slug}`,
    },
  };
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-sm font-serif font-medium text-ink mb-3">{children}</h2>
);

const Divider = () => <div className="h-px bg-wire my-5" />;

const PropertyDetailPage = async ({ params }: Props) => {
  const { slug } = await params;

  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const relatedProperties = await getRelatedProperties(
    { id: property.id, type: property.type, city: property.city },
    3,
  );

  const { price, note } = formatPriceWithNote(property);
  const address = [property.address, property.city].filter(Boolean).join(", ");
  const hasUnits = property.units.length > 0;
  const hasDeveloperInfo =
    property.developerName ||
    property.projectPhase ||
    property.expectedTurnover;
  const hasMap = property.latitude != null && property.longitude != null;

  return (
    <main className="bg-white min-h-screen">
      <nav className="px-6 py-3 border-b border-wire flex items-center gap-2">
        <Link
          href="/"
          className="text-xs text-ash hover:text-ink transition-colors"
        >
          Home
        </Link>
        <span className="text-xs text-wire">/</span>
        <Link
          href="/properties"
          className="text-xs text-ash hover:text-ink transition-colors"
        >
          Properties
        </Link>
        <span className="text-xs text-wire">/</span>
        <span className="text-xs text-ink font-medium line-clamp-1">
          {property.title}
        </span>
      </nav>

      <div className="px-6 pt-5 pb-3 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-medium text-ink leading-snug tracking-tight mb-1.5">
            {property.title}
          </h1>
          {address && (
            <div className="flex items-center gap-1.5 text-xs text-ash">
              <MapPin className="w-3 h-3 shrink-0" />
              {address}
            </div>
          )}
        </div>
      </div>

      {/* ── Photo gallery ───────────────────────────────────────────── */}
      {/* <PropertyGallery images={property.images} title={property.title} /> */}

      {/* ── Body — two column layout ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-0 px-6 max-w-screen-xl mx-auto">
        {/* ── Left — main content ───────────────────────────────────── */}
        <div className="py-6 lg:pr-8 lg:border-r lg:border-wire">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={clsx(
                "text-xs font-medium px-3 py-1 rounded-full",
                STATUS_STYLES[property.status],
              )}
            >
              {STATUS_LABELS[property.status]}
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-cloud text-ash border border-wire">
              {property.listingType === "RESALE" ? "Resale" : "Brand New"}
            </span>
            {property.isFeatured && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-cloud text-ink border border-wire">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 py-4 border-t border-b border-wire mb-5">
            <span className="text-3xl font-serif font-medium text-ink tracking-tight">
              {price}
            </span>
            {note && <span className="text-sm text-ash">{note}</span>}
            {property.floorLevel && property.totalFloors && (
              <span className="text-sm text-fog ml-2">
                · Floor {property.floorLevel} of {property.totalFloors}
              </span>
            )}
          </div>

          {/* Specs grid */}
          {(property.bedrooms != null ||
            property.bathrooms != null ||
            property.floorArea != null ||
            property.parking != null) && (
            <div className="grid grid-cols-4 divide-x divide-wire border border-wire rounded-xl overflow-hidden mb-5">
              {property.bedrooms != null && (
                <div className="py-3 text-center">
                  <p className="text-base font-medium text-ink">
                    {property.bedrooms === 0 ? "Studio" : property.bedrooms}
                  </p>
                  <p className="text-[10px] text-fog mt-0.5">
                    {property.bedrooms === 0 ? "" : "Bedrooms"}
                  </p>
                </div>
              )}
              {property.bathrooms != null && (
                <div className="py-3 text-center">
                  <p className="text-base font-medium text-ink">
                    {property.bathrooms}
                  </p>
                  <p className="text-[10px] text-fog mt-0.5">Bathrooms</p>
                </div>
              )}
              {property.floorArea != null && (
                <div className="py-3 text-center">
                  <p className="text-base font-medium text-ink">
                    {property.floorArea}sqm
                  </p>
                  <p className="text-[10px] text-fog mt-0.5">Floor area</p>
                </div>
              )}
              {property.lotArea != null && !property.floorArea && (
                <div className="py-3 text-center">
                  <p className="text-base font-medium text-ink">
                    {property.lotArea}sqm
                  </p>
                  <p className="text-[10px] text-fog mt-0.5">Lot area</p>
                </div>
              )}
              {property.parking != null && (
                <div className="py-3 text-center">
                  <p className="text-base font-medium text-ink">
                    {property.parking}
                  </p>
                  <p className="text-[10px] text-fog mt-0.5">Parking</p>
                </div>
              )}
            </div>
          )}

          <SectionTitle>About this property</SectionTitle>
          <p className="text-sm text-ash leading-relaxed">
            {property.description}
          </p>

          {(property.beachFrontage ||
            property.hasDock ||
            property.isTourismZoned) && (
            <>
              <Divider />
              <SectionTitle>Beach & vacation details</SectionTitle>
              <div className="grid grid-cols-3 gap-0 border border-wire rounded-xl overflow-hidden">
                {property.beachFrontage && (
                  <div className="py-3 px-4">
                    <p className="text-base font-medium text-ink">
                      {property.beachFrontage}m
                    </p>
                    <p className="text-[10px] text-fog mt-0.5">
                      Beach frontage
                    </p>
                  </div>
                )}
                {property.hasDock && (
                  <div className="py-3 px-4 border-l border-wire">
                    <p className="text-sm font-medium text-ink">Yes</p>
                    <p className="text-[10px] text-fog mt-0.5">Boat dock</p>
                  </div>
                )}
                {property.isTourismZoned && (
                  <div className="py-3 px-4 border-l border-wire">
                    <p className="text-sm font-medium text-ink">Tourism</p>
                    <p className="text-[10px] text-fog mt-0.5">Zoning</p>
                  </div>
                )}
                {property.isAirbnbReady && (
                  <div className="py-3 px-4 border-l border-wire">
                    <p className="text-sm font-medium text-ink">Ready</p>
                    <p className="text-[10px] text-fog mt-0.5">Airbnb</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* {hasUnits && (
            <>
              <Divider />
              <SectionTitle>Unit types</SectionTitle>
              <p className="text-xs text-fog mb-3">
                This property has multiple unit types — select one to see specs
                and pricing
              </p>
              <UnitSelector
                units={property.units}
                propertyTitle={property.title}
              />
            </>
          )} */}

          {/* Developer info — only for pre-selling */}
          {hasDeveloperInfo && (
            <>
              <Divider />
              <SectionTitle>Developer information</SectionTitle>
              <div className="grid grid-cols-3 divide-x divide-wire border border-wire rounded-xl overflow-hidden">
                {property.developerName && (
                  <div className="py-3 px-4">
                    <p className="text-sm font-medium text-ink">
                      {property.developerName}
                    </p>
                    <p className="text-[10px] text-fog mt-0.5">Developer</p>
                  </div>
                )}
                {property.projectPhase && (
                  <div className="py-3 px-4">
                    <p className="text-sm font-medium text-ink">
                      {property.projectPhase}
                    </p>
                    <p className="text-[10px] text-fog mt-0.5">Project phase</p>
                  </div>
                )}
                {property.expectedTurnover && (
                  <div className="py-3 px-4">
                    <p className="text-sm font-medium text-ink">
                      {property.expectedTurnover}
                    </p>
                    <p className="text-[10px] text-fog mt-0.5">
                      Expected turnover
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Amenities
          {property.amenities.length > 0 && (
            <>
              <Divider />
              <SectionTitle>Amenities</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity: PropertyAmenity) => (
                  <div
                    key={amenity.id}
                    className="flex items-center gap-2.5 text-sm text-ash"
                  >
                    <div className="w-7 h-7 bg-cloud rounded-lg flex items-center justify-center shrink-0 border border-wire">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#1d1d1f"
                        strokeWidth="1.5"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    {amenity.name}
                  </div>
                ))}
              </div>
            </>
          )} */}

          {/* Payment schemes */}
          {/* {property.paymentSchemes.length > 0 && (
            <>
              <Divider />
              <SectionTitle>Payment schemes</SectionTitle>
              <div className="flex flex-col gap-2">
                {property.paymentSchemes.map(
                  (scheme: PropertyPaymentScheme) => (
                    <div
                      key={scheme.id}
                      className="border border-wire rounded-xl px-4 py-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-ink">
                          {PAYMENT_TYPE_LABELS[scheme.type] ?? scheme.type}
                        </p>
                        {scheme.description && (
                          <p className="text-xs text-ash mt-0.5">
                            {scheme.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        {scheme.monthlyAmount ? (
                          <>
                            <p className="text-sm font-medium text-ink">
                              ₱{scheme.monthlyAmount.toLocaleString()}/mo
                            </p>
                            {scheme.interestRate && scheme.terms && (
                              <p className="text-[10px] text-fog mt-0.5">
                                {scheme.interestRate}% · {scheme.terms} months
                              </p>
                            )}
                          </>
                        ) : scheme.downPayment ? (
                          <>
                            <p className="text-sm font-medium text-ink">
                              ₱{scheme.downPayment.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-fog mt-0.5">
                              Down payment
                            </p>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </>
          )} */}

          {/* {property.landmarks.length > 0 && (
            <>
              <Divider />
              <SectionTitle>Nearby landmarks</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {property.landmarks.map((landmark: PropertyLandmark) => (
                  <div
                    key={landmark.id}
                    className="bg-cloud rounded-xl px-4 py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {landmark.name}
                      </p>
                      {landmark.category && (
                        <p className="text-[10px] text-fog mt-0.5">
                          {landmark.category}
                        </p>
                      )}
                    </div>
                    {landmark.distance && (
                      <p className="text-sm font-medium text-ink shrink-0 ml-4">
                        {landmark.distance}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )} */}
          {/* 
          {hasMap && (
            <>
              <Divider />
              <SectionTitle>Location</SectionTitle>
              <PropertyMap
                latitude={property.latitude!}
                longitude={property.longitude!}
                title={property.title}
              />
            </>
          )} */}

          {/* {relatedProperties.length > 0 && (
            <>
              <Divider />
              <SectionTitle>Similar properties</SectionTitle>
              <RelatedProperties properties={relatedProperties} />
            </>
          )} */}
        </div>

        <div className="hidden lg:block py-6 pl-8">
          <div className="sticky top-17">
            {/* <ContactSidebar
              property={{
                title: property.title,
                price: property.price,
                priceLabel: property.priceLabel,
                status: property.status,
                city: property.city,
                barangay: property.barangay,
                floorLevel: property.floorLevel,
                isPagibigAccredited: property.isPagibigAccredited,
                isBankFinancingReady: property.isBankFinancingReady,
                isInHouseFinancing: property.isInHouseFinancing,
                isRentToOwn: property.isRentToOwn,
              }}
            /> */}
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-wire px-4 py-3 flex gap-2 z-40">
        <a
          href={`${process.env.NEXT_PUBLIC_MESSENGER_URL ?? "https://m.me/amelialawsin"}?text=${encodeURIComponent(
            `Hi Amelia! I'm interested in: ${property.title}`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-ink text-white text-sm font-medium py-2.5 rounded-xl text-center"
        >
          Message Amelia
        </a>
        <a
          href={`sms:${process.env.NEXT_PUBLIC_PHONE ?? ""}?body=${encodeURIComponent(
            `Hi Amelia! I'm interested in: ${property.title}`,
          )}`}
          className="flex-1 bg-cloud text-ink text-sm font-medium py-2.5 rounded-xl text-center border border-wire"
        >
          Send SMS
        </a>
      </div>
    </main>
  );
};

export default PropertyDetailPage;
