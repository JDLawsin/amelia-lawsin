import Link from "next/link";
import { Button } from "@/components/ui/shadcn/button";
import PropertyCard from "../ui/properties/PropertyCard";
import { PropertyListItem } from "@/services/property.service";

type Props = {
  properties: PropertyListItem[];
};

const FeaturedProperties = ({ properties }: Props) => {
  if (!properties.length) return null;

  return (
    <section className="py-14 px-4 bg-cloud border-wire">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-2xl font-serif font-semibold text-ink">
            {"Featured Properties"}
          </h2>
          <div className="w-8 h-0.5 bg-ink mt-2 mb-3" />
          <p className="text-sm text-ash">
            {"Handpicked listings across Cebu"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              className="shadow-apple-lg"
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            asChild
            variant="outline"
            className="border-wire text-ink hover:bg-ink hover:text-white transition-colors"
          >
            <Link href="/properties">{"View all properties"}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
