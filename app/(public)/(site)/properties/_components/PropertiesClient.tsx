"use client";



import { useState, useMemo, useCallback, useEffect, useRef } from "react";

import { useSearchParams } from "next/navigation";

import { PropertyListItem } from "@/services/property.service";

import { normalizeBrowseView } from "@/lib/property-browse";

import { buildPropertyListFilterSignature } from "@/lib/property-filters";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

import useUpdateQueryString from "@/hooks/useQueryString";

import SearchBar from "./SearchBar";

import ChipsRow from "./ChipsRow";

import AppliedFiltersRow from "./AppliedFiltersRow";

import FilterPanel from "./FilterPanel";

import FilterSheet from "./FilterSheet";

import ResultsMeta from "./ResultsMeta";

import PropertyGrid from "./PropertyGrid";

import PropertyInfiniteList from "./PropertyInfiniteList";

import PropertiesMapBrowse from "./PropertiesMapBrowse";

import Pagination from "@/components/ui/Pagination";



type Props = {

  properties: PropertyListItem[];

  total: number;

  pageSize: number;

  currentPage: number;

};



const PropertiesClient = ({

  properties,

  total,

  pageSize,

  currentPage,

}: Props) => {

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const [filterKey, setFilterKey] = useState(0);
  const [mapLiveTotal, setMapLiveTotal] = useState<number | null>(null);

  const searchParams = useSearchParams();

  const updateQueryString = useUpdateQueryString();

  const isMobile = useMediaQuery("(max-width: 767px)");

  const isDesktop = useMediaQuery("(min-width: 768px)");



  const view = normalizeBrowseView(searchParams.get("view"), isMobile);

  const isMapView = view === "map";

  const initializedMobileDefault = useRef(false);

  const normalizedMobilePage = useRef(false);



  const listFilterSignature = useMemo(

    () => buildPropertyListFilterSignature(searchParams),

    [searchParams],

  );



  useEffect(() => {

    if (initializedMobileDefault.current || !isMobile) return;

    if (!searchParams.has("view")) {

      initializedMobileDefault.current = true;

      updateQueryString({ view: "list", page: "1" }, [], { replace: true });

    }

  }, [isMobile, searchParams, updateQueryString]);



  useEffect(() => {

    if (!isMobile || isMapView || normalizedMobilePage.current) return;

    const page = searchParams.get("page");

    if (page && page !== "1") {

      normalizedMobilePage.current = true;

      updateQueryString({ page: "1" }, [], { replace: true });

    }

  }, [isMobile, isMapView, searchParams, updateQueryString]);



  useEffect(() => {
    if (!isMapView) setMapLiveTotal(null);
  }, [isMapView]);

  const displayTotal =
    isMapView && mapLiveTotal != null ? mapLiveTotal : total;

  const activeFilterCount = useMemo(() => {
    const filterKeys = [
      "status",
      "type",
      "city",
      "minPrice",
      "maxPrice",
      "bedrooms",
      "special",
    ];

    return filterKeys.filter((key) => searchParams.has(key)).length;
  }, [searchParams]);



  const handleFilterToggle = useCallback(() => {

    if (isDesktop) {

      setIsFilterOpen((prev) => {

        const next = !prev;

        if (next) setFilterKey((k) => k + 1);

        return next;

      });

    } else {

      setFilterKey((k) => k + 1);

      setIsFilterSheetOpen(true);

    }

  }, [isDesktop]);



  return (

    <div className="flex flex-col pb-10 max-w-7xl mx-auto w-full">

      <div
        className={
          isMapView
            ? "sticky top-0 z-30 bg-background/95 backdrop-blur"
            : "sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80"
        }
      >

        <SearchBar

          isFilterOpen={isDesktop ? isFilterOpen : isFilterSheetOpen}

          onFilterToggle={handleFilterToggle}

          activeFilterCount={activeFilterCount}

          compact={isMapView && isMobile}

        />

        {isDesktop && isFilterOpen && (

          <FilterPanel key={filterKey} isOpen={isFilterOpen} />

        )}

      </div>



      {!isMapView && <ChipsRow />}



      <FilterSheet

        key={filterKey}

        open={isFilterSheetOpen}

        onOpenChange={setIsFilterSheetOpen}

      />



      {!isMapView && <AppliedFiltersRow />}

      <ResultsMeta total={displayTotal} />

      {isMapView ? (
        <PropertiesMapBrowse
          initialProperties={properties}
          initialTotal={total}
          pageSize={pageSize}
          filterSignature={listFilterSignature}
          onTotalChange={setMapLiveTotal}
        />

      ) : isMobile ? (

        <PropertyInfiniteList

          key={listFilterSignature}

          initialProperties={properties}

          initialTotal={total}

          pageSize={pageSize}

          filterSignature={listFilterSignature}

          view={view}

        />

      ) : (

        <>

          <PropertyGrid properties={properties} view={view} />

          {total > pageSize && (

            <div className="mt-6 -mx-6 px-6">

              <Pagination

                page={currentPage}

                pageSize={pageSize}

                total={total}

                label="properties"

              />

            </div>

          )}

        </>

      )}

    </div>

  );

};



export default PropertiesClient;

