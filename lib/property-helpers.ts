import { PaymentSchemeType } from "@/app/generated/prisma/enums";
import {
  normalizeForMatching,
  formatForStorage,
  generatePaymentSchemeName,
} from "./normalization";
import { prisma } from "./prisma";

type AmenityInput = { name: string; icon?: string };
type LandmarkInput = { name: string; category?: string; distance?: string };
type PaymentSchemeInput = {
  type: PaymentSchemeType;
  description?: string;
  downPayment?: number;
  monthlyAmount?: number;
  terms?: number;
  interestRate?: number;
};

export const findOrCreateAmenity = async (input: AmenityInput) => {
  const normalized = normalizeForMatching(input.name);

  const existing = await prisma.amenity.findUnique({
    where: { nameNormalized: normalized },
  });

  if (existing) {
    return { amenityId: existing.id };
  }

  return {
    amenity: {
      create: {
        name: formatForStorage(input.name),
        nameNormalized: normalized,
        icon: input.icon,
      },
    },
  };
};

export const findOrCreateLandmark = async (input: LandmarkInput) => {
  const normalized = normalizeForMatching(input.name);

  const existing = await prisma.landmark.findUnique({
    where: { nameNormalized: normalized },
  });

  if (existing) {
    return {
      landmarkId: existing.id,
      distance: input.distance,
    };
  }

  return {
    landmark: {
      create: {
        name: formatForStorage(input.name),
        nameNormalized: normalized,
        category: input.category,
      },
    },
    distance: input.distance,
  };
};

export const findOrCreatePaymentScheme = async (input: PaymentSchemeInput) => {
  const schemeName = generatePaymentSchemeName({
    type: input.type,
    downPayment: input.downPayment,
    terms: input.terms,
    interestRate: input.interestRate,
  });

  const existing = await prisma.paymentScheme.findUnique({
    where: {
      type_name: {
        type: input.type,
        name: schemeName,
      },
    },
  });

  if (existing) {
    return { paymentSchemeId: existing.id };
  }

  return {
    paymentScheme: {
      create: {
        type: input.type,
        name: schemeName,
        description: input.description,
        downPayment: input.downPayment,
        monthlyAmount: input.monthlyAmount,
        terms: input.terms,
        interestRate: input.interestRate,
      },
    },
  };
};

export const processAmenities = async (amenities: AmenityInput[]) => {
  return Promise.all(amenities.map(findOrCreateAmenity));
};

export const processLandmarks = async (landmarks: LandmarkInput[]) => {
  return Promise.all(landmarks.map(findOrCreateLandmark));
};

export const processPaymentSchemes = async (schemes: PaymentSchemeInput[]) => {
  return Promise.all(schemes.map(findOrCreatePaymentScheme));
};
