import DataTable, { DataTableColumn } from "@/components/ui/DataTable";
import { PropertyAdminListItem } from "@/services/property.admin.service";
import PropertyRows from "./PropertyRows";

const COLUMNS: DataTableColumn[] = [
  { key: "property", label: "Property", className: "w-[40%]" },
  { key: "type", label: "Type", className: "hidden md:table-cell" },
  { key: "status", label: "Status" },
  { key: "price", label: "Price", className: "hidden lg:table-cell" },
  { key: "actions", label: "Actions", className: "text-right" },
];

type Props = {
  properties: PropertyAdminListItem[];
  total: number;
  page: number;
  pageSize: number;
  filters: { q?: string; status?: string; type?: string };
};

const Properties = ({ properties, total, page, pageSize, filters }: Props) => (
  <>
    <DataTable
      columns={COLUMNS}
      isEmpty={properties.length === 0}
      page={page}
      pageSize={pageSize}
      total={total}
      paginationLabel="listings"
    >
      <PropertyRows properties={properties} />
    </DataTable>
  </>
);

export default Properties;
