import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

const COLUMNS = ["Property", "Type", "Status", "Price", "Actions"];

export default function TableSkeleton() {
  return (
    <div className="bg-white border border-wire rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-cloud">
              {COLUMNS.map((col) => (
                <TableHead
                  key={col}
                  className="text-[10px] uppercase tracking-wider"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-12 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
