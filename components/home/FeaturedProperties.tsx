import Link from "next/link";
import { PropertyListItem } from "@/services/property.service";
import PropertyCard from "@/app/(public)/(site)/properties/_components/PropertyCard";
import { ctaSecondary } from "@/components/ui/cta";
import FeaturedPropertiesSnapRow from "./FeaturedPropertiesSnapRow";

type Props = {
  properties: PropertyListItem[];
};

const FeaturedProperties = ({ properties }: Props) => {
  if (!properties.length) return null;

  return (
    <section className="border-b border-wire bg-cloud px-6 py-20 md:py-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="mx-auto mb-12 max-w-2xl text-center text-3xl font-serif font-medium leading-tight tracking-[-0.025em] text-ink md:text-4xl">
          Handpicked featured properties across Cebu
        </h2>

        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {properties.map((property, i) => (
            <PropertyCard
              key={property.id}
              property={property}
              priority={i === 0}
              className="shadow-apple-lg"
            />
          ))}
        </div>

        <FeaturedPropertiesSnapRow properties={properties} />

        <div className="flex justify-center mt-8">
          <Link href="/properties" className={ctaSecondary}>
            View all properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
