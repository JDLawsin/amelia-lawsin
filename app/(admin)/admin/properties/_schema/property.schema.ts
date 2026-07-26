import {
  ListingType,
  PaymentSchemeType,
  PropertyStatus,
  PropertyType,
} from "@/app/generated/prisma/enums";

import { z } from "zod";

const optionalNumber = z.preprocess(
  (v) => (v === "" || v == null ? undefined : Number(v)),
  z.number().positive().optional(),
);

const optionalNonNegativeNumber = z.preprocess(
  (v) => (v === "" || v == null ? undefined : Number(v)),
  z.number().nonnegative().optional(), // ≥ 0
);

const optionalString = z
  .string()
  .trim()
  .transform((v) => v || undefined)
  .optional();

const booleanField = z.preprocess(
  (v) => v === "on" || v === "true" || v === true,
  z.boolean().default(false),
);

export const BasicsSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
  type: z
    .enum(Object.values(PropertyType), {
      error: "Please select a valid property type",
    })
    .describe("Property type is required"),
  status: z.enum(Object.values(PropertyStatus), {
    error: "Please select a valid status",
  }),
  listingType: z
    .enum(Object.values(ListingType), {
      error: "Please select a valid listing type",
    })
    .default("BRAND_NEW"),
  isFeatured: booleanField,
});

export const LocationSchema = z.object({
  address: z.string().min(3, "Address is required"),
  city: z.string().min(1, "City is required"),
  barangay: optionalString,
  latitude: optionalNumber,
  longitude: optionalNumber,
});

export const SpecsSchema = z.object({
  price: optionalNumber,
  priceLabel: optionalString,
  floorArea: optionalNumber,
  lotArea: optionalNumber,
  bedrooms: optionalNumber,
  bathrooms: optionalNumber,
  parking: optionalNonNegativeNumber,
  monthlyRent: optionalNumber,
  associationDue: optionalNumber,
  floorLevel: optionalString,
  totalFloors: optionalNumber,
});

export const FeaturesSchema = z.object({
  isPagibigAccredited: booleanField,
  isBankFinancingReady: booleanField,
  isInHouseFinancing: booleanField,
  isRentToOwn: booleanField,
  hasDock: booleanField,
  isTourismZoned: booleanField,
  isAirbnbReady: booleanField,
  beachFrontage: optionalNumber,
});

export const DeveloperSchema = z.object({
  developerName: optionalString,
  projectPhase: optionalString,
  expectedTurnover: optionalString,
});

export const PropertyUnitSchema = z.object({
  label: z.string().min(1, "Unit label is required"),
  status: z.enum(Object.values(PropertyStatus)).optional(),
  price: optionalNumber,
  priceLabel: optionalString,
  floorArea: optionalNumber,
  lotArea: optionalNumber,
  bedrooms: optionalNumber,
  bathrooms: optionalNumber,
  parking: optionalNonNegativeNumber,
  towerOrPhase: optionalString,
  floorPlanImage: optionalString,
  floorPlanPublicId: optionalString,
  floorPlanImageFile: z.instanceof(File).optional(),
});

export const PropertyAmenitySchema = z.object({
  name: z.string().min(1, "Amenity name is required"),
  icon: optionalString,
});

export const PropertyPaymentSchemeSchema = z.object({
  type: z.enum(Object.values(PaymentSchemeType)),
  description: optionalString,
  downPayment: optionalNumber,
  monthlyAmount: optionalNumber,
  terms: optionalNumber,
  interestRate: optionalNumber,
});

export const PropertyLandmarkSchema = z.object({
  name: z.string().min(1, "Landmark name is required"),
  category: optionalString,
  distance: optionalString,
});

export const ImageItemSchema = z.object({
  id: z.string().optional(),
  file: z.instanceof(File).optional(),
  url: z.string().optional(),
  caption: optionalString,
  order: z.number().default(0),
  isPrimary: z.boolean().default(false),
});

export const FullPropertySchema = BasicsSchema.merge(LocationSchema)
  .merge(SpecsSchema)
  .merge(FeaturesSchema)
  .merge(DeveloperSchema)
  .extend({
    imageItems: z.array(ImageItemSchema).default([]),
    units: z.array(PropertyUnitSchema).default([]),
    amenities: z.array(PropertyAmenitySchema).default([]),
    paymentSchemes: z.array(PropertyPaymentSchemeSchema).default([]),
    landmarks: z.array(PropertyLandmarkSchema).default([]),
  });

export type FullPropertyFormValues = z.infer<typeof FullPropertySchema>;

export const STEP_SCHEMAS = {
  Basics: BasicsSchema,
  Location: LocationSchema,
  Specs: SpecsSchema,
  Features: FeaturesSchema,
  Developer: DeveloperSchema,
  Units: PropertyUnitSchema,
  Amenities: PropertyAmenitySchema,
  "Payment Plans": PropertyPaymentSchemeSchema,
  Landmarks: PropertyLandmarkSchema,
  Media: z.array(ImageItemSchema),
} as const;

export type StepName = keyof typeof STEP_SCHEMAS;

export const STEP_FIELD_NAMES = {
  Basics: [
    "title",
    "slug",
    "description",
    "type",
    "status",
    "listingType",
    "isFeatured",
  ] as const,
  Location: ["address", "city", "barangay", "latitude", "longitude"] as const,
  Specs: [
    "price",
    "priceLabel",
    "floorArea",
    "lotArea",
    "bedrooms",
    "bathrooms",
    "parking",
    "monthlyRent",
    "associationDue",
    "floorLevel",
    "totalFloors",
  ] as const,
  Features: [
    "isPagibigAccredited",
    "isBankFinancingReady",
    "isInHouseFinancing",
    "isRentToOwn",
    "hasDock",
    "isTourismZoned",
    "isAirbnbReady",
    "beachFrontage",
  ] as const,
  Developer: ["developerName", "projectPhase", "expectedTurnover"] as const,
  Units: ["units"],
  Amenities: ["amenities"],
  "Payment Plans": ["paymentSchemes"],
  Landmarks: ["landmarks"],
  Media: ["imageItems"] as const,
} as const;

export const PROPERTY_TABS: StepName[] = [
  "Basics",
  "Location",
  "Specs",
  "Features",
  "Developer",
  "Units",
  "Amenities",
  "Payment Plans",
  "Landmarks",
  "Media",
];
