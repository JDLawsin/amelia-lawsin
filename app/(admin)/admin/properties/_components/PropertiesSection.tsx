import {
  getAdminProperties,
  getAdminPropertiesCount,
  type PropertyAdminFilters,
} from "@/services/property.admin.service";
import Properties from "./Properties";

type Props = {
  filters: PropertyAdminFilters;
  page: number;
  pageSize: number;
};

const PropertiesSection = async ({ filters, page, pageSize }: Props) => {
  const [properties, total] = await Promise.all([
    getAdminProperties(filters),
    getAdminPropertiesCount(filters),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-ash">
        {total} listing{total !== 1 ? "s" : ""} total
      </p>

      <Properties
        properties={properties}
        total={total}
        page={page}
        pageSize={pageSize}
        filters={filters}
      />
    </div>
  );
};

export default PropertiesSection;
