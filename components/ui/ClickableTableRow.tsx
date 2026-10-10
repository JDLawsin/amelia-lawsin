"use client";

import Link from "next/link";
import { createContext, useContext, type ReactNode } from "react";
import clsx from "clsx";
import { TableCell, TableRow } from "@/components/ui/shadcn/table";

const RowHrefContext = createContext<string | null>(null);

type ClickableTableRowProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

const ClickableTableRow = ({
  href,
  className,
  children,
}: ClickableTableRowProps) => (
  <RowHrefContext.Provider value={href}>
    <TableRow className={clsx("cursor-pointer", className)}>{children}</TableRow>
  </RowHrefContext.Provider>
);

type ClickableTableCellProps = {
  children: ReactNode;
  className?: string;
  primary?: boolean;
};

export function ClickableTableCell({
  children,
  className,
  primary = false,
}: ClickableTableCellProps) {
  const href = useContext(RowHrefContext);

  if (!href) {
    return <TableCell className={className}>{children}</TableCell>;
  }

  return (
    <TableCell className={clsx("relative", className)}>
      <Link
        href={href}
        className="absolute inset-0 z-0"
        {...(primary
          ? { "aria-label": "View details" }
          : { tabIndex: -1, "aria-hidden": true })}
      />
      <span className="relative z-10 block pointer-events-none">{children}</span>
    </TableCell>
  );
}

export function TableRowActionsCell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <TableCell className={clsx("relative z-20", className)}>{children}</TableCell>
  );
}

export default ClickableTableRow;
