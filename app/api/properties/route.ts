import { NextResponse } from "next/server";
import {
  getAllProperties,
  getMapProperties,
  getPropertiesCount,
} from "@/services/property.service";
import {
  DEFAULT_PROPERTIES_PAGE_SIZE,
  parsePropertyFilters,
} from "@/lib/property-filters";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageSizeParam = searchParams.get("pageSize");
  const pageSize = pageSizeParam
    ? Math.min(50, Math.max(1, Number(pageSizeParam)))
    : DEFAULT_PROPERTIES_PAGE_SIZE;

  const filters = parsePropertyFilters(searchParams, { pageSize });

  if (searchParams.get("forMap") === "1") {
    const properties = await getMapProperties(filters);
    const total = await getPropertiesCount(filters);
    return NextResponse.json({
      properties,
      total,
      page: 1,
      pageSize: properties.length,
    });
  }

  const [properties, total] = await Promise.all([
    getAllProperties(filters),
    getPropertiesCount(filters),
  ]);

  return NextResponse.json({
    properties,
    total,
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? pageSize,
  });
}
