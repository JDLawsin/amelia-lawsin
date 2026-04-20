export const mapPropertyData = (data: any) => ({
  title: data.title,
  slug: data.slug,
  description: data.description,
  type: data.type,
  status: data.status,
  listingType: data.listingType,
  isFeatured: data.isFeatured,
  address: data.address,
  city: data.city,
  barangay: data.barangay ?? null,
  latitude: data.latitude ?? null,
  longitude: data.longitude ?? null,
  price: data.price ?? null,
  priceLabel: data.priceLabel ?? null,
  floorArea: data.floorArea ?? null,
  lotArea: data.lotArea ?? null,
  bedrooms: data.bedrooms ?? null,
  bathrooms: data.bathrooms ?? null,
  parking: data.parking ?? 0,
  monthlyRent: data.monthlyRent ?? null,
  associationDue: data.associationDue ?? null,
  floorLevel: data.floorLevel ?? null,
  totalFloors: data.totalFloors ?? null,
  beachFrontage: data.beachFrontage ?? null,
  hasDock: data.hasDock,
  isTourismZoned: data.isTourismZoned,
  isAirbnbReady: data.isAirbnbReady,
  isPagibigAccredited: data.isPagibigAccredited,
  isBankFinancingReady: data.isBankFinancingReady,
  isInHouseFinancing: data.isInHouseFinancing,
  isRentToOwn: data.isRentToOwn,
  developerName: data.developerName ?? null,
  projectPhase: data.projectPhase ?? null,
  expectedTurnover: data.expectedTurnover ?? null,
});

export const mapUnit = (unit: any) => ({
  label: unit.label,
  status: unit.status ?? null,
  price: unit.price ?? null,
  priceLabel: unit.priceLabel ?? null,
  floorArea: unit.floorArea ?? null,
  lotArea: unit.lotArea ?? null,
  bedrooms: unit.bedrooms ?? null,
  bathrooms: unit.bathrooms ?? null,
  parking: unit.parking ?? 0,
  towerOrPhase: unit.towerOrPhase ?? null,
  floorPlanImage: unit.floorPlanImage ?? null,
  floorPlanPublicId: unit.floorPlanPublicId ?? null,
});

export const mapPropertyToForm = (property: any) => ({
  // Basics
  title: property.title,
  slug: property.slug,
  description: property.description,
  type: property.type,
  status: property.status,
  listingType: property.listingType,
  isFeatured: property.isFeatured,

  // Location
  address: property.address,
  city: property.city,
  barangay: property.barangay ?? undefined,
  latitude: property.latitude ?? undefined,
  longitude: property.longitude ?? undefined,

  // Specs
  price: property.price ?? undefined,
  priceLabel: property.priceLabel ?? undefined,
  floorArea: property.floorArea ?? undefined,
  lotArea: property.lotArea ?? undefined,
  bedrooms: property.bedrooms ?? undefined,
  bathrooms: property.bathrooms ?? undefined,
  parking: property.parking ?? undefined,
  monthlyRent: property.monthlyRent ?? undefined,
  associationDue: property.associationDue ?? undefined,
  floorLevel: property.floorLevel ?? undefined,
  totalFloors: property.totalFloors ?? undefined,

  // Features
  beachFrontage: property.beachFrontage ?? undefined,
  hasDock: property.hasDock,
  isTourismZoned: property.isTourismZoned,
  isAirbnbReady: property.isAirbnbReady,
  isPagibigAccredited: property.isPagibigAccredited,
  isBankFinancingReady: property.isBankFinancingReady,
  isInHouseFinancing: property.isInHouseFinancing,
  isRentToOwn: property.isRentToOwn,

  // Developer
  developerName: property.developerName ?? undefined,
  projectPhase: property.projectPhase ?? undefined,
  expectedTurnover: property.expectedTurnover ?? undefined,

  // Relations - will be populated separately
  images: [],
  units: property.units?.map(mapUnitToForm) ?? [],
  amenities: property.amenities?.map(mapAmenityToForm) ?? [],
  paymentSchemes: property.paymentSchemes?.map(mapPaymentSchemeToForm) ?? [],
  landmarks: property.landmarks?.map(mapLandmarkToForm) ?? [],
});

export const mapUnitToForm = (unit: any) => ({
  label: unit.label,
  status: unit.status ?? undefined,
  price: unit.price ?? undefined,
  priceLabel: unit.priceLabel ?? undefined,
  floorArea: unit.floorArea ?? undefined,
  lotArea: unit.lotArea ?? undefined,
  bedrooms: unit.bedrooms ?? undefined,
  bathrooms: unit.bathrooms ?? undefined,
  parking: unit.parking ?? undefined,
  towerOrPhase: unit.towerOrPhase ?? undefined,
  floorPlanImage: unit.floorPlanImage ?? undefined,
  floorPlanPublicId: unit.floorPlanPublicId ?? undefined,
});

export const mapAmenityToForm = (item: any) => ({
  name: item.amenity.name,
  icon: item.amenity.icon ?? undefined,
});

export const mapPaymentSchemeToForm = (item: any) => ({
  type: item.paymentScheme.type,
  description: item.paymentScheme.description ?? undefined,
  downPayment: item.paymentScheme.downPayment ?? undefined,
  monthlyAmount: item.paymentScheme.monthlyAmount ?? undefined,
  terms: item.paymentScheme.terms ?? undefined,
  interestRate: item.paymentScheme.interestRate ?? undefined,
});

export const mapLandmarkToForm = (item: any) => ({
  name: item.landmark.name,
  category: item.landmark.category ?? undefined,
  distance: item.distance ?? undefined,
});
