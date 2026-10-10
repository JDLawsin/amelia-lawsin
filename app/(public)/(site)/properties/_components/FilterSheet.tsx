"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/shadcn/sheet";
import type { LocalFilterState } from "@/lib/property-browse-chips";
import { emptyLocalFilterState } from "@/lib/property-browse-chips";
import { useFilterPreviewCount } from "@/lib/hooks/useFilterPreviewCount";
import FilterPanelContent from "./FilterPanelContent";

type FilterSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FilterSheet = ({ open, onOpenChange }: FilterSheetProps) => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  const [localFilters, setLocalFilters] = useState<LocalFilterState>(
    emptyLocalFilterState(),
  );

  const handleLocalFiltersChange = useCallback((filters: LocalFilterState) => {
    setLocalFilters(filters);
  }, []);

  const { previewTotal, isPreviewLoading } = useFilterPreviewCount({
    enabled: open,
    localFilters,
    searchQuery,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] overflow-y-auto overscroll-contain rounded-t-2xl px-5 pb-6 pt-2 md:hidden"
      >
        <SheetHeader className="text-left mb-4">
          <SheetTitle>Filter properties</SheetTitle>
          <SheetDescription>
            Narrow by listing status, property type, price, bedrooms, location,
            and financing.
          </SheetDescription>
        </SheetHeader>
        <FilterPanelContent
          onApplied={() => onOpenChange(false)}
          previewEnabled={open}
          previewTotal={previewTotal}
          isPreviewLoading={isPreviewLoading}
          onLocalFiltersChange={handleLocalFiltersChange}
        />
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
