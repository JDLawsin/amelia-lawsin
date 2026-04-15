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

export const mapAmenity = (a: any) => ({
  name: a.name,
  icon: a.icon ?? null,
});

export const mapPaymentScheme = (s: any) => ({
  type: s.type,
  description: s.description ?? null,
  downPayment: s.downPayment ?? null,
  monthlyAmount: s.monthlyAmount ?? null,
  terms: s.terms ?? null,
  interestRate: s.interestRate ?? null,
});

export const mapLandmark = (l: any) => ({
  name: l.name,
  category: l.category ?? null,
  distance: l.distance ?? null,
});
