import { notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ensureMetaDescription } from "@/lib/metadata-helpers";
import { preloadLcpImage } from "@/lib/preload-lcp-image";
import {
  PROPERTY_GALLERY_PRIMARY_HEIGHT,
  PROPERTY_GALLERY_PRIMARY_SIZES,
  PROPERTY_GALLERY_PRIMARY_WIDTH,
} from "@/lib/image-layout";
import { MapPin } from "lucide-react";
import clsx from "clsx";
import type { Metadata } from "next";
import {
  getPropertyBySlug,
  getRelatedProperties,
} from "@/services/property.service";
import {
  PAYMENT_TYPE_LABELS,
  STATUS_LABELS,
  STATUS_STYLES,
  TYPE_LABELS,
} from "@/constants";
import { getSiteUrl } from "@/lib/site";
import { ogImageMetadata } from "@/lib/og-metadata";
import {
  breadcrumbListJsonLd,
  realEstateListingJsonLd,
} from "@/lib/structured-data";
import JsonLd from "@/components/ui/JsonLd";
import { formatPriceWithNote } from "@/lib/utils";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { CompareButton } from "@/components/tools/CompareButton";
import PropertyGallery from "./_components/PropertyGallery";
import PropertyGalleryGrid from "./_components/PropertyGalleryGrid";
import UnitSelector from "./_components/UnitSelector";
import RelatedProperties from "./_components/RelatedProperties";
import ContactSidebar from "./_components/ContactSidebar";

const PropertyMap = dynamic(() => import("./_components/PropertyMap"), {
  loading: () => (
    <div
      className="h-52 rounded-xl bg-cloud border border-wire animate-pulse motion-reduce:animate-none"
      aria-hidden="true"
    />
  ),
});

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Property not found",
      description: ensureMetaDescription(
        null,
        "Browse Cebu properties with Amelia Lawsin — licensed real estate agent.",
      ),
    };
  }

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

  // absolute title: the root layout's `%s | Amelia Lawsin` template would
  // double-suffix these long-tail titles, so bypass it here.
  const title = `${property.title} ${STATUS_LABELS[property.status] ?? ""} | Amelia Lawsin`;

  const primaryImage =
    property.images.find((i) => i.isPrimary) ?? property.images[0];

  const description = ensureMetaDescription(
    [
      price,
      specs,
      property.address,
      property.description.slice(0, 120),
    ]
      .filter(Boolean)
      .join(" · "),
    `${property.title} — ${TYPE_LABELS[property.type] ?? "Property"} ${STATUS_LABELS[property.status] ?? "listing"} in ${property.city ?? "Cebu"}. Inquire with Amelia Lawsin for viewings and financing.`,
  );

  const ogImages = primaryImage?.url
    ? [{ url: primaryImage.url, alt: property.title }]
    : ogImageMetadata(
        `/properties/${slug}`,
        `${property.title} — Cebu property listing`,
      );

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      images: ogImages,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
    alternates: {
      canonical: `/properties/${slug}`,
    },
  };
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-sm font-serif font-medium text-ink mb-3">{children}</h2>
);

const Divider = () => <div className="my-5" />;

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
  const baseUrl = getSiteUrl();
  const hasDeveloperInfo =
    property.developerName ||
    property.projectPhase ||
    property.expectedTurnover;
  const hasMap = property.latitude != null && property.longitude != null;

  const primaryImage =
    property.images.find((i) => i.isPrimary) ?? property.images[0];
  if (primaryImage?.url) {
    preloadLcpImage(primaryImage.url, property.title, {
      width: PROPERTY_GALLERY_PRIMARY_WIDTH,
      height: PROPERTY_GALLERY_PRIMARY_HEIGHT,
      sizes: PROPERTY_GALLERY_PRIMARY_SIZES,
    });
  }

  return (
    <main className="bg-white min-h-screen">
      <JsonLd
        data={[
          realEstateListingJsonLd(baseUrl, property),
          breadcrumbListJsonLd(baseUrl, [
            { name: "Home", url: "/" },
            { name: "Properties", url: "/properties" },
            { name: property.title, url: `/properties/${property.slug}` },
          ]),
        ]}
      />
      <nav className="py-3 flex items-center gap-2 max-w-7xl mx-auto">
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

      <PropertyGallery images={property.images} title={property.title}>
        <PropertyGalleryGrid images={property.images} title={property.title} />
      </PropertyGallery>

      <div className="px-6 pt-5 pb-3 flex items-start justify-between gap-4 max-w-7xl mx-auto">
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
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-[10px] font-medium uppercase tracking-wide text-ash">
            Save Listing
          </span>
          <div className="flex items-center gap-2 rounded-xl border border-wire bg-cloud/50 p-1.5">
            <FavoriteButton slug={property.slug} size="md" />
            <CompareButton slug={property.slug} size="md" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-0 px-6 max-w-7xl mx-auto">
        <div className="py-6 lg:pr-8">
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

          <div className="flex items-baseline gap-2 py-4  mb-5">
            <span className="text-3xl font-serif font-medium text-ink tracking-tight">
              {price}
            </span>
            {note && <span className="text-sm text-ash">{note}</span>}
            {property.floorLevel && property.totalFloors && (
              <span className="text-sm text-ash ml-2">
                · Floor {property.floorLevel} of {property.totalFloors}
              </span>
            )}
          </div>

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
                  <p className="text-xs text-ash mt-0.5">
                    {property.bedrooms === 0 ? "" : "Bedrooms"}
                  </p>
                </div>
              )}
              {property.bathrooms != null && (
                <div className="py-3 text-center">
                  <p className="text-base font-medium text-ink">
                    {property.bathrooms}
                  </p>
                  <p className="text-xs text-ash mt-0.5">Bathrooms</p>
                </div>
              )}
              {property.floorArea != null && (
                <div className="py-3 text-center">
                  <p className="text-base font-medium text-ink">
                    {property.floorArea}sqm
                  </p>
                  <p className="text-xs text-ash mt-0.5">Floor area</p>
                </div>
              )}
              {property.lotArea != null && !property.floorArea && (
                <div className="py-3 text-center">
                  <p className="text-base font-medium text-ink">
                    {property.lotArea}sqm
                  </p>
                  <p className="text-xs text-ash mt-0.5">Lot area</p>
                </div>
              )}
              {property.parking != null && (
                <div className="py-3 text-center">
                  <p className="text-base font-medium text-ink">
                    {property.parking}
                  </p>
                  <p className="text-xs text-ash mt-0.5">Parking</p>
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
              <SectionTitle>Beach & vacation details</SectionTitle>
              <div className="grid grid-cols-3 gap-0 border border-wire rounded-xl overflow-hidden">
                {property.beachFrontage && (
                  <div className="py-3 px-4">
                    <p className="text-base font-medium text-ink">
                      {property.beachFrontage}m
                    </p>
                    <p className="text-xs text-ash mt-0.5">
                      Beach frontage
                    </p>
                  </div>
                )}
                {property.hasDock && (
                  <div className="py-3 px-4 border-l border-wire">
                    <p className="text-sm font-medium text-ink">Yes</p>
                    <p className="text-xs text-ash mt-0.5">Boat dock</p>
                  </div>
                )}
                {property.isTourismZoned && (
                  <div className="py-3 px-4 border-l border-wire">
                    <p className="text-sm font-medium text-ink">Tourism</p>
                    <p className="text-xs text-ash mt-0.5">Zoning</p>
                  </div>
                )}
                {property.isAirbnbReady && (
                  <div className="py-3 px-4 border-l border-wire">
                    <p className="text-sm font-medium text-ink">Ready</p>
                    <p className="text-xs text-ash mt-0.5">Airbnb</p>
                  </div>
                )}
              </div>
            </>
          )}

          {hasUnits && (
            <>
              <Divider />
              <SectionTitle>Unit types</SectionTitle>
              <p className="text-xs text-ash mb-3">
                This property has multiple unit types — select one to see specs
                and pricing
              </p>
              <UnitSelector
                units={property.units}
                propertyTitle={property.title}
              />
            </>
          )}

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
                    <p className="text-xs text-ash mt-0.5">Developer</p>
                  </div>
                )}
                {property.projectPhase && (
                  <div className="py-3 px-4">
                    <p className="text-sm font-medium text-ink">
                      {property.projectPhase}
                    </p>
                    <p className="text-xs text-ash mt-0.5">Project phase</p>
                  </div>
                )}
                {property.expectedTurnover && (
                  <div className="py-3 px-4">
                    <p className="text-sm font-medium text-ink">
                      {property.expectedTurnover}
                    </p>
                    <p className="text-xs text-ash mt-0.5">
                      Expected turnover
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {property.amenities.length > 0 && (
            <>
              <Divider />
              <SectionTitle>Amenities</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((propertyAmenity) => (
                  <div
                    key={propertyAmenity.id}
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
                    {propertyAmenity.amenity.name}
                  </div>
                ))}
              </div>
            </>
          )}

          {property.paymentSchemes.length > 0 && (
            <>
              <Divider />
              <SectionTitle>Payment schemes</SectionTitle>
              <div className="flex flex-col gap-2">
                {property.paymentSchemes.map((scheme) => {
                  const paymentScheme = scheme.paymentScheme;
                  if (!paymentScheme) return null;

                  return (
                    <div
                      key={scheme.id}
                      className="border border-wire rounded-xl px-4 py-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-ink">
                          {PAYMENT_TYPE_LABELS[paymentScheme.type] ??
                            paymentScheme.type}
                        </p>
                        {paymentScheme.description && (
                          <p className="text-xs text-ash mt-0.5">
                            {paymentScheme.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        {paymentScheme.monthlyAmount ? (
                          <>
                            <p className="text-sm font-medium text-ink">
                              ₱{paymentScheme.monthlyAmount.toLocaleString()}/mo
                            </p>
                            {paymentScheme.interestRate &&
                              paymentScheme.terms && (
                                <p className="text-xs text-ash mt-0.5">
                                  {paymentScheme.interestRate}% ·{" "}
                                  {paymentScheme.terms} months
                                </p>
                              )}
                          </>
                        ) : paymentScheme.downPayment ? (
                          <>
                            <p className="text-sm font-medium text-ink">
                              ₱{paymentScheme.downPayment.toLocaleString()}
                            </p>
                            <p className="text-xs text-ash mt-0.5">
                              Down payment
                            </p>
                          </>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-ash mt-3 leading-relaxed">
                * Monthly computations are estimates only and may vary depending
                on your lender, credit standing, and applicable fees. Contact
                Amelia for an accurate breakdown tailored to your situation.
              </p>
            </>
          )}

          {property.landmarks.length > 0 && (
            <>
              <Divider />
              <SectionTitle>Nearby landmarks</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {property.landmarks.map((propertyLandmark) => (
                  <div
                    key={propertyLandmark.id}
                    className="bg-cloud rounded-xl px-4 py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {propertyLandmark.landmark.name}
                      </p>
                      {propertyLandmark.landmark.category && (
                        <p className="text-xs text-ash mt-0.5">
                          {propertyLandmark.landmark.category}
                        </p>
                      )}
                    </div>
                    {propertyLandmark.distance && (
                      <p className="text-sm font-medium text-ink shrink-0 ml-4">
                        {propertyLandmark.distance}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

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
          )}

          <div className="lg:hidden">
            <Divider />
            <SectionTitle>Interested in this property?</SectionTitle>
            <ContactSidebar
              property={{
                title: property.title,
                slug: property.slug,
                type: property.type,
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
            />
          </div>

          {relatedProperties.length > 0 && (
            <>
              <Divider />
              <SectionTitle>Similar properties</SectionTitle>
              <RelatedProperties properties={relatedProperties} />
            </>
          )}
        </div>

        <div className="hidden lg:block py-6 pl-8">
          <div className="sticky top-17">
            <ContactSidebar
              property={{
                title: property.title,
                slug: property.slug,
                type: property.type,
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
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default PropertyDetailPage;
