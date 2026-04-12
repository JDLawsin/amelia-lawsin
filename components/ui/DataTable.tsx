import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import { FileX } from "lucide-react";
import Pagination from "./Pagination";

export type DataTableColumn = {
  key: string;
  label: string;
  className?: string;
};

type Props = {
  columns: DataTableColumn[];
  children: React.ReactNode;
  empty?: React.ReactNode;
  isEmpty: boolean;
  page: number;
  pageSize: number;
  total: number;
  paginationLabel?: string;
};

const DefaultEmpty = () => (
  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
    <div className="w-12 h-12 bg-cloud border border-wire rounded-full flex items-center justify-center">
      <FileX className="w-5 h-5 text-fog" />
    </div>
    <div>
      <p className="text-sm font-medium text-ink">Nothing found</p>
      <p className="text-xs text-ash mt-0.5">
        Try adjusting your search or filters
      </p>
    </div>
  </div>
);

const DataTable = ({
  columns,
  children,
  empty,
  isEmpty,
  page,
  pageSize,
  total,
  paginationLabel,
}: Props) => (
  <div className="bg-white border border-wire rounded-2xl overflow-hidden">
    {isEmpty ? (
      (empty ?? <DefaultEmpty />)
    ) : (
      <>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-cloud hover:bg-cloud border-b border-wire">
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={`text-[10px] font-medium text-fog uppercase tracking-wider ${col.className ?? ""}`}
                  >
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>{children}</TableBody>
          </Table>
        </div>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          label={paginationLabel}
        />
      </>
    )}
  </div>
);

export default DataTable;
