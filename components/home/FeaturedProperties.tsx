import Link from "next/link";
import { PropertyListItem } from "@/services/property.service";
import PropertyCard from "@/app/(public)/properties/_components/PropertyCard";
import SectionLabel from "@/components/ui/SectionLabel";
import { ctaSecondary } from "@/components/ui/cta";

type Props = {
  properties: PropertyListItem[];
};

const FeaturedProperties = ({ properties }: Props) => {
  if (!properties.length) return null;

  return (
    <section className="py-14 px-6 bg-cloud border-b border-wire">
      <div className="max-w-7xl mx-auto">
        <SectionLabel>Featured properties</SectionLabel>
        <h2 className="text-2xl md:text-3xl font-serif font-medium text-ink tracking-tight leading-snug text-center mb-10">
          Handpicked listings across Cebu
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {properties.map((property, i) => (
            <PropertyCard
              key={property.id}
              property={property}
              priority={i === 0}
              className="shadow-apple-lg"
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Link href="/properties" className={ctaSecondary}>
            View all properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
