// prisma/seed.ts
// Run with: npx prisma db seed
import "dotenv/config";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Clean existing data ───────────────────────────────────────────────────
  await prisma.propertyLandmark.deleteMany();
  await prisma.propertyPaymentScheme.deleteMany();
  await prisma.propertyAmenity.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.propertyUnit.deleteMany();
  await prisma.property.deleteMany();
  console.log("🧹 Cleaned existing data");

  // ─────────────────────────────────────────────────────────────────────────
  // 1. 2BR CONDO — Avida Towers IT Park (For Sale, Resale, Featured)
  // ─────────────────────────────────────────────────────────────────────────
  await prisma.property.create({
    data: {
      title: "2-Bedroom Condo at Avida Towers Cebu",
      slug: "2br-condo-avida-towers-cebu",
      description:
        "A fully furnished 2-bedroom unit at Avida Towers in the heart of IT Park, Cebu City. Ideal for professionals, young families, and investors looking for a high-demand rental area. Features a stunning city view, modern finishes, and full access to resort-style amenities. Walking distance to major offices, restaurants, and Ayala Center Cebu.",
      type: "CONDO",
      status: "FOR_SALE",
      listingType: "RESALE",
      isFeatured: true,
      address: "Avida Towers Cebu, Cebu IT Park, Lahug",
      city: "Cebu City",
      barangay: "Lahug",
      latitude: 10.331,
      longitude: 123.905,
      price: 5200000,
      floorArea: 45,
      bedrooms: 2,
      bathrooms: 1,
      parking: 1,
      floorLevel: "12",
      totalFloors: 40,
      isBankFinancingReady: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            publicId: "seed/avida_1",
            isPrimary: true,
            order: 1,
            caption: "Living area with city view",
          },
          {
            url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            publicId: "seed/avida_2",
            isPrimary: false,
            order: 2,
            caption: "Master bedroom",
          },
          {
            url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
            publicId: "seed/avida_3",
            isPrimary: false,
            order: 3,
            caption: "Modern kitchen",
          },
        ],
      },
      amenities: {
        create: [
          { name: "Swimming Pool", icon: "waves" },
          { name: "Gym / Fitness Center", icon: "dumbbell" },
          { name: "24/7 Security", icon: "shield" },
          { name: "CCTV Surveillance", icon: "camera" },
          { name: "Lobby Lounge", icon: "sofa" },
          { name: "Parking", icon: "car" },
        ],
      },
      paymentSchemes: {
        create: [
          { type: "SPOT_CASH", description: "Full payment upon signing" },
          {
            type: "BANK_FINANCING",
            description: "BDO / BPI — up to 20 years",
            downPayment: 520000,
            monthlyAmount: 27000,
            terms: 240,
            interestRate: 7.5,
          },
        ],
      },
      landmarks: {
        create: [
          { name: "Ayala Center Cebu", category: "Mall", distance: "0.5 km" },
          {
            name: "IT Park Loop",
            category: "Business District",
            distance: "0.1 km",
          },
          {
            name: "Chong Hua Hospital",
            category: "Hospital",
            distance: "1.2 km",
          },
          {
            name: "Mactan Cebu International Airport",
            category: "Airport",
            distance: "12 km",
          },
        ],
      },
    },
  });
  console.log("✅ 1/10 Avida Towers 2BR Condo");

  // ─────────────────────────────────────────────────────────────────────────
  // 2. HOUSE & LOT — Consolacion (For Sale, Brand New, Featured, Pag-IBIG)
  // ─────────────────────────────────────────────────────────────────────────
  await prisma.property.create({
    data: {
      title: "3-Bedroom House & Lot in Consolacion",
      slug: "3br-house-lot-consolacion-cebu",
      description:
        "Spacious 3-bedroom house and lot in a quiet, well-secured subdivision in Consolacion, Cebu. Perfect for families looking for a peaceful neighborhood just 20 minutes from Cebu City. Pag-IBIG accredited — great for OFWs and first-time homebuyers. Features a carport for 2 cars and a garden.",
      type: "HOUSE_AND_LOT",
      status: "FOR_SALE",
      listingType: "BRAND_NEW",
      isFeatured: true,
      address: "Greenfield Subdivision, Brgy. Tayud, Consolacion",
      city: "Consolacion",
      barangay: "Tayud",
      latitude: 10.382,
      longitude: 123.96,
      price: 8500000,
      lotArea: 150,
      floorArea: 120,
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      isPagibigAccredited: true,
      isBankFinancingReady: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
            publicId: "seed/consolacion_1",
            isPrimary: true,
            order: 1,
            caption: "Front exterior",
          },
          {
            url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
            publicId: "seed/consolacion_2",
            isPrimary: false,
            order: 2,
            caption: "Living room",
          },
          {
            url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
            publicId: "seed/consolacion_3",
            isPrimary: false,
            order: 3,
            caption: "Garden area",
          },
        ],
      },
      amenities: {
        create: [
          { name: "Carport (2 cars)", icon: "car" },
          { name: "Garden", icon: "tree-pine" },
          { name: "24/7 Subdivision Security", icon: "shield" },
          { name: "Basketball Court", icon: "circle" },
        ],
      },
      paymentSchemes: {
        create: [
          {
            type: "PAG_IBIG_FINANCING",
            description: "Pag-IBIG Fund — up to 30 years",
            downPayment: 850000,
            monthlyAmount: 38000,
            terms: 360,
            interestRate: 6.375,
          },
          {
            type: "BANK_FINANCING",
            description: "BDO / BPI — up to 20 years",
            downPayment: 850000,
            monthlyAmount: 44000,
            terms: 240,
            interestRate: 7.5,
          },
          {
            type: "SPOT_CASH",
            description: "5% discount for full cash payment",
          },
        ],
      },
      landmarks: {
        create: [
          { name: "SM City Consolacion", category: "Mall", distance: "2.5 km" },
          { name: "CCLEX Toll", category: "Highway", distance: "3 km" },
          {
            name: "Consolacion Community Hospital",
            category: "Hospital",
            distance: "1.8 km",
          },
          {
            name: "Cebu City Proper",
            category: "City Center",
            distance: "12 km",
          },
        ],
      },
    },
  });
  console.log("✅ 2/10 Consolacion House & Lot");

  // ─────────────────────────────────────────────────────────────────────────
  // 3. PRE-SELLING CONDO — ATO Residences Mandaue (Multi-unit, Featured)
  // ─────────────────────────────────────────────────────────────────────────
  await prisma.property.create({
    data: {
      title: "ATO Residences — Pre-selling Condo in Mandaue",
      slug: "ato-residences-pre-selling-mandaue",
      description:
        "ATO Residences is a premier pre-selling condominium in Mandaue City, minutes from Cebu's major business districts. Choose from Studio to 3-Bedroom units with flexible payment terms. In-house financing available with 0% interest during the pre-selling period. Expected turnover Q4 2027.",
      type: "CONDO",
      status: "PRE_SELLING",
      listingType: "BRAND_NEW",
      isFeatured: true,
      address: "A. Soriano Ave, Mandaue City",
      city: "Mandaue City",
      barangay: "Cambaro",
      latitude: 10.35,
      longitude: 123.935,
      priceLabel: "Starts at ₱3,500,000",
      totalFloors: 28,
      isPagibigAccredited: true,
      isBankFinancingReady: true,
      isInHouseFinancing: true,
      developerName: "ATO Properties Inc.",
      projectPhase: "Phase 1 — Tower A",
      expectedTurnover: "Q4 2027",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
            publicId: "seed/ato_1",
            isPrimary: true,
            order: 1,
            caption: "Tower A perspective",
          },
          {
            url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800",
            publicId: "seed/ato_2",
            isPrimary: false,
            order: 2,
            caption: "Amenity deck",
          },
          {
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            publicId: "seed/ato_3",
            isPrimary: false,
            order: 3,
            caption: "Sample 2BR unit",
          },
        ],
      },
      amenities: {
        create: [
          { name: "Infinity Pool", icon: "waves" },
          { name: "Gym / Fitness Center", icon: "dumbbell" },
          { name: "Function Hall", icon: "building-2" },
          { name: "24/7 Security", icon: "shield" },
          { name: "Underground Parking", icon: "car" },
          { name: "Sky Lounge", icon: "cloud" },
          { name: "Children's Play Area", icon: "smile" },
        ],
      },
      paymentSchemes: {
        create: [
          {
            type: "IN_HOUSE_FINANCING",
            description:
              "10% DP, balance via in-house — 0% interest for 2 years",
            downPayment: 350000,
            monthlyAmount: 12000,
            terms: 24,
            interestRate: 0,
          },
          {
            type: "PAG_IBIG_FINANCING",
            description: "Pag-IBIG Fund — up to 30 years after turnover",
            interestRate: 6.375,
            terms: 360,
          },
          {
            type: "BANK_FINANCING",
            description: "BDO, BPI, Metrobank — up to 20 years",
            interestRate: 7.5,
            terms: 240,
          },
        ],
      },
      units: {
        create: [
          {
            label: "Studio",
            price: 3500000,
            floorArea: 25,
            bedrooms: 0,
            bathrooms: 1,
            parking: 0,
            towerOrPhase: "Tower A",
          },
          {
            label: "1-Bedroom",
            price: 5200000,
            floorArea: 45,
            bedrooms: 1,
            bathrooms: 1,
            parking: 1,
            towerOrPhase: "Tower A",
          },
          {
            label: "2-Bedroom",
            price: 8500000,
            floorArea: 75,
            bedrooms: 2,
            bathrooms: 2,
            parking: 1,
            towerOrPhase: "Tower A",
          },
          {
            label: "3-Bedroom",
            price: 15000000,
            floorArea: 120,
            bedrooms: 3,
            bathrooms: 3,
            parking: 2,
            towerOrPhase: "Tower A",
          },
        ],
      },
      landmarks: {
        create: [
          { name: "SM City Cebu", category: "Mall", distance: "3 km" },
          {
            name: "Perpetual Succour Hospital",
            category: "Hospital",
            distance: "2 km",
          },
          {
            name: "Mactan Cebu International Airport",
            category: "Airport",
            distance: "8 km",
          },
          {
            name: "Mandaue City Hall",
            category: "Government",
            distance: "1.5 km",
          },
        ],
      },
    },
  });
  console.log("✅ 3/10 ATO Residences Pre-selling");

  // ─────────────────────────────────────────────────────────────────────────
  // 4. CONDO FOR RENT — Solinea Tower 3, Cebu Business Park
  // ─────────────────────────────────────────────────────────────────────────
  await prisma.property.create({
    data: {
      title: "1-Bedroom Condo for Rent at Solinea Tower 3",
      slug: "1br-condo-for-rent-solinea-tower-3",
      description:
        "Fully furnished 1-bedroom unit at Solinea Tower 3, one of Cebu City's most sought-after condo developments. Located in Cebu Business Park, surrounded by restaurants, hotels, and corporate offices. Ideal for expats and professionals. Association dues included in monthly rate.",
      type: "CONDO",
      status: "FOR_RENT",
      listingType: "RESALE",
      isFeatured: false,
      address: "Solinea Tower 3, Cebu Business Park, Cebu City",
      city: "Cebu City",
      barangay: "Cebu Business Park",
      latitude: 10.3175,
      longitude: 123.9054,
      monthlyRent: 35000,
      associationDue: 5000,
      floorArea: 40,
      bedrooms: 1,
      bathrooms: 1,
      parking: 1,
      floorLevel: "18",
      totalFloors: 45,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            publicId: "seed/solinea_1",
            isPrimary: true,
            order: 1,
            caption: "Living area",
          },
          {
            url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
            publicId: "seed/solinea_2",
            isPrimary: false,
            order: 2,
            caption: "Bedroom",
          },
        ],
      },
      amenities: {
        create: [
          { name: "Swimming Pool", icon: "waves" },
          { name: "Gym", icon: "dumbbell" },
          { name: "24/7 Security", icon: "shield" },
          { name: "Concierge", icon: "bell" },
          { name: "Parking", icon: "car" },
        ],
      },
      paymentSchemes: {
        create: [
          {
            type: "SPOT_CASH",
            description: "2 months advance + 2 months deposit",
          },
        ],
      },
      landmarks: {
        create: [
          { name: "Ayala Center Cebu", category: "Mall", distance: "0.3 km" },
          {
            name: "Cebu Business Park",
            category: "Business District",
            distance: "0.1 km",
          },
          {
            name: "Chong Hua Hospital",
            category: "Hospital",
            distance: "1 km",
          },
        ],
      },
    },
  });
  console.log("✅ 4/10 Solinea 1BR For Rent");

  // ─────────────────────────────────────────────────────────────────────────
  // 5. BEACH VACATION — Mactan Beachfront Lot (For Sale, Featured)
  // ─────────────────────────────────────────────────────────────────────────
  await prisma.property.create({
    data: {
      title: "Beachfront Lot in Mactan, Lapu-Lapu City",
      slug: "beachfront-lot-mactan-lapu-lapu",
      description:
        "Rare beachfront lot in a prime location in Mactan Island, Lapu-Lapu City. Just minutes from world-class resorts and the Mactan Cebu International Airport. Tourism-zoned — ideal for resort development, vacation rentals, or AirBnB. Features 30 meters of beach frontage and an existing boat dock.",
      type: "BEACH_VACATION",
      status: "FOR_SALE",
      listingType: "RESALE",
      isFeatured: true,
      address: "Brgy. Maribago, Lapu-Lapu City, Cebu",
      city: "Lapu-Lapu City",
      barangay: "Maribago",
      latitude: 10.2926,
      longitude: 124.0024,
      price: 45000000,
      lotArea: 800,
      isBankFinancingReady: true,
      beachFrontage: 30,
      hasDock: true,
      isTourismZoned: true,
      isAirbnbReady: false,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
            publicId: "seed/mactan_1",
            isPrimary: true,
            order: 1,
            caption: "Beachfront view",
          },
          {
            url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800",
            publicId: "seed/mactan_2",
            isPrimary: false,
            order: 2,
            caption: "Beach area",
          },
          {
            url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
            publicId: "seed/mactan_3",
            isPrimary: false,
            order: 3,
            caption: "Aerial view",
          },
        ],
      },
      amenities: {
        create: [
          { name: "30m Beach Frontage", icon: "waves" },
          { name: "Boat Dock", icon: "anchor" },
          { name: "Tourism Zoned", icon: "map-pin" },
          { name: "Gated", icon: "shield" },
        ],
      },
      paymentSchemes: {
        create: [
          { type: "SPOT_CASH", description: "Full payment — negotiable" },
          {
            type: "BANK_FINANCING",
            description: "Bank financing available for qualified buyers",
            interestRate: 8.0,
            terms: 120,
          },
        ],
      },
      landmarks: {
        create: [
          {
            name: "Shangri-La Mactan Resort",
            category: "Resort",
            distance: "1.5 km",
          },
          {
            name: "Mactan Cebu International Airport",
            category: "Airport",
            distance: "5 km",
          },
          {
            name: "Mactan Newtown",
            category: "Business District",
            distance: "3 km",
          },
        ],
      },
    },
  });
  console.log("✅ 5/10 Mactan Beachfront Lot");

  // ─────────────────────────────────────────────────────────────────────────
  // 6. TOWNHOUSE — Talisay City (For Sale, Rent-to-Own)
  // ─────────────────────────────────────────────────────────────────────────
  await prisma.property.create({
    data: {
      title: "3-Bedroom Townhouse in Talisay City",
      slug: "3br-townhouse-talisay-city-cebu",
      description:
        "Modern 3-bedroom townhouse in a prime location in Talisay City, just south of Cebu City. Perfect for young families and OFWs looking for an affordable but spacious home near the city. Rent-to-own terms available — own your home with low monthly payments and minimal down payment.",
      type: "TOWNHOUSE",
      status: "FOR_SALE",
      listingType: "BRAND_NEW",
      isFeatured: false,
      address: "South Palms Residences, Talisay City, Cebu",
      city: "Talisay City",
      barangay: "Biasong",
      latitude: 10.2442,
      longitude: 123.8488,
      price: 6800000,
      lotArea: 80,
      floorArea: 110,
      bedrooms: 3,
      bathrooms: 2,
      parking: 1,
      isPagibigAccredited: true,
      isBankFinancingReady: true,
      isRentToOwn: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800",
            publicId: "seed/townhouse_1",
            isPrimary: true,
            order: 1,
            caption: "Exterior view",
          },
          {
            url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
            publicId: "seed/townhouse_2",
            isPrimary: false,
            order: 2,
            caption: "Living and dining area",
          },
        ],
      },
      amenities: {
        create: [
          { name: "Carport", icon: "car" },
          { name: "24/7 Security", icon: "shield" },
          { name: "Clubhouse", icon: "building-2" },
          { name: "Swimming Pool (Subdivision)", icon: "waves" },
        ],
      },
      paymentSchemes: {
        create: [
          {
            type: "RENT_TO_OWN",
            description:
              "₱35,000/month for 5 years, balance as balloon payment",
            monthlyAmount: 35000,
            terms: 60,
          },
          {
            type: "PAG_IBIG_FINANCING",
            description: "Pag-IBIG Fund — up to 30 years",
            downPayment: 680000,
            monthlyAmount: 31000,
            terms: 360,
            interestRate: 6.375,
          },
          {
            type: "BANK_FINANCING",
            description: "Partner banks — up to 20 years",
            downPayment: 680000,
            monthlyAmount: 37000,
            terms: 240,
            interestRate: 7.5,
          },
        ],
      },
      landmarks: {
        create: [
          { name: "SM City Talisay", category: "Mall", distance: "1.5 km" },
          {
            name: "Talisay City Hall",
            category: "Government",
            distance: "2 km",
          },
          {
            name: "Cebu South Bus Terminal",
            category: "Transport",
            distance: "8 km",
          },
          {
            name: "Cebu City Proper",
            category: "City Center",
            distance: "15 km",
          },
        ],
      },
    },
  });
  console.log("✅ 6/10 Talisay Townhouse");

  // ─────────────────────────────────────────────────────────────────────────
  // 7. LOT ONLY — Minglanilla (For Sale)
  // ─────────────────────────────────────────────────────────────────────────
  await prisma.property.create({
    data: {
      title: "Corner Residential Lot in Minglanilla, Cebu",
      slug: "corner-lot-minglanilla-cebu",
      description:
        "A prime 250sqm corner residential lot in a peaceful subdivision in Minglanilla, Cebu. Clean title (TCT), ready for construction. Ideal for those who want to build their dream home from the ground up. Accessible to the South Road Properties (SRP) and just 30 minutes from Cebu City.",
      type: "LOT_ONLY",
      status: "FOR_SALE",
      listingType: "RESALE",
      isFeatured: false,
      address: "Springville Homes, Minglanilla, Cebu",
      city: "Minglanilla",
      barangay: "Ward 1",
      latitude: 10.2381,
      longitude: 123.7978,
      price: 3200000,
      lotArea: 250,
      isBankFinancingReady: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
            publicId: "seed/lot_1",
            isPrimary: true,
            order: 1,
            caption: "Lot area",
          },
          {
            url: "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800",
            publicId: "seed/lot_2",
            isPrimary: false,
            order: 2,
            caption: "Subdivision road",
          },
        ],
      },
      amenities: {
        create: [
          { name: "Clean Title (TCT)", icon: "file-check" },
          { name: "Concrete Roads", icon: "map" },
          { name: "Water & Electricity Ready", icon: "zap" },
          { name: "24/7 Security", icon: "shield" },
        ],
      },
      paymentSchemes: {
        create: [
          { type: "SPOT_CASH", description: "Full cash — negotiable" },
          {
            type: "BANK_FINANCING",
            description: "Bank financing available",
            downPayment: 640000,
            terms: 120,
            interestRate: 8.0,
          },
        ],
      },
      landmarks: {
        create: [
          {
            name: "South Road Properties (SRP)",
            category: "Highway",
            distance: "2 km",
          },
          {
            name: "Minglanilla Public Market",
            category: "Market",
            distance: "1.5 km",
          },
          {
            name: "Cebu City South Bus Terminal",
            category: "Transport",
            distance: "20 km",
          },
        ],
      },
    },
  });
  console.log("✅ 7/10 Minglanilla Corner Lot");

  // ─────────────────────────────────────────────────────────────────────────
  // 8. COMMERCIAL — Office Space IT Park (For Rent)
  // ─────────────────────────────────────────────────────────────────────────
  await prisma.property.create({
    data: {
      title: "200sqm Office Space for Rent in Cebu IT Park",
      slug: "office-space-for-rent-cebu-it-park",
      description:
        "Prime 200sqm office space on the 8th floor of a Class A building in Cebu IT Park. Perfect for BPO companies, startups, and corporate offices. Includes 3 dedicated parking slots, 24/7 building access, backup generator, and high-speed internet-ready infrastructure. PEZA-registered zone.",
      type: "COMMERCIAL",
      status: "FOR_RENT",
      listingType: "BRAND_NEW",
      isFeatured: false,
      address: "One Horizon Center, IT Park, Lahug, Cebu City",
      city: "Cebu City",
      barangay: "Lahug",
      latitude: 10.332,
      longitude: 123.906,
      monthlyRent: 120000,
      associationDue: 15000,
      floorArea: 200,
      parking: 3,
      floorLevel: "8",
      totalFloors: 22,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
            publicId: "seed/office_1",
            isPrimary: true,
            order: 1,
            caption: "Office interior",
          },
          {
            url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
            publicId: "seed/office_2",
            isPrimary: false,
            order: 2,
            caption: "Open floor layout",
          },
          {
            url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
            publicId: "seed/office_3",
            isPrimary: false,
            order: 3,
            caption: "Meeting room",
          },
        ],
      },
      amenities: {
        create: [
          { name: "Dedicated Parking (3 slots)", icon: "car" },
          { name: "24/7 Building Access", icon: "key" },
          { name: "Backup Generator", icon: "zap" },
          { name: "High-Speed Internet Ready", icon: "wifi" },
          { name: "PEZA Zone", icon: "building-2" },
          { name: "CCTV Surveillance", icon: "camera" },
        ],
      },
      paymentSchemes: {
        create: [
          {
            type: "SPOT_CASH",
            description: "3 months advance + 2 months deposit",
          },
        ],
      },
      landmarks: {
        create: [
          {
            name: "IT Park Loop",
            category: "Business District",
            distance: "0.1 km",
          },
          { name: "Ayala Center Cebu", category: "Mall", distance: "0.7 km" },
          {
            name: "Chong Hua Hospital",
            category: "Hospital",
            distance: "1.2 km",
          },
        ],
      },
    },
  });
  console.log("✅ 8/10 IT Park Office Space");

  // ─────────────────────────────────────────────────────────────────────────
  // 9. HOUSE & LOT SUBDIVISION — Liloan (Pre-Selling, Multi-model)
  // ─────────────────────────────────────────────────────────────────────────
  await prisma.property.create({
    data: {
      title: "Havila Residences — House & Lot in Liloan, Cebu",
      slug: "havila-residences-house-lot-liloan-cebu",
      description:
        "Havila Residences is a master-planned residential subdivision in Liloan, Northern Cebu. Choose from 3 house models — Amber, Breeze, and Crown — each designed for comfort, functionality, and style. Pag-IBIG and bank financing available. A perfect home for growing families north of Cebu City.",
      type: "HOUSE_AND_LOT",
      status: "PRE_SELLING",
      listingType: "BRAND_NEW",
      isFeatured: false,
      address: "Havila Residences, Brgy. Catarman, Liloan, Cebu",
      city: "Liloan",
      barangay: "Catarman",
      latitude: 10.3981,
      longitude: 123.995,
      priceLabel: "Starts at ₱4,800,000",
      isPagibigAccredited: true,
      isBankFinancingReady: true,
      isInHouseFinancing: true,
      developerName: "Havila Land Corporation",
      projectPhase: "Phase 1",
      expectedTurnover: "Q2 2026",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
            publicId: "seed/liloan_1",
            isPrimary: true,
            order: 1,
            caption: "Crown model unit",
          },
          {
            url: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800",
            publicId: "seed/liloan_2",
            isPrimary: false,
            order: 2,
            caption: "Subdivision entrance",
          },
          {
            url: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800",
            publicId: "seed/liloan_3",
            isPrimary: false,
            order: 3,
            caption: "Clubhouse",
          },
        ],
      },
      amenities: {
        create: [
          { name: "Clubhouse", icon: "building-2" },
          { name: "Swimming Pool", icon: "waves" },
          { name: "Basketball Court", icon: "circle" },
          { name: "Children's Playground", icon: "smile" },
          { name: "24/7 Security", icon: "shield" },
        ],
      },
      paymentSchemes: {
        create: [
          {
            type: "IN_HOUSE_FINANCING",
            description: "15% DP, 0% interest for 36 months",
            downPayment: 720000,
            monthlyAmount: 18000,
            terms: 36,
            interestRate: 0,
          },
          {
            type: "PAG_IBIG_FINANCING",
            description: "Pag-IBIG Fund housing loan",
            downPayment: 480000,
            monthlyAmount: 24000,
            terms: 360,
            interestRate: 6.375,
          },
          {
            type: "BANK_FINANCING",
            description: "BDO, BPI — up to 20 years",
            downPayment: 480000,
            monthlyAmount: 29000,
            terms: 240,
            interestRate: 7.5,
          },
        ],
      },
      units: {
        create: [
          {
            label: "Amber Model",
            price: 4800000,
            lotArea: 80,
            floorArea: 80,
            bedrooms: 3,
            bathrooms: 2,
            parking: 1,
            towerOrPhase: "Phase 1",
          },
          {
            label: "Breeze Model",
            price: 6500000,
            lotArea: 100,
            floorArea: 110,
            bedrooms: 4,
            bathrooms: 2,
            parking: 2,
            towerOrPhase: "Phase 1",
          },
          {
            label: "Crown Model",
            price: 9800000,
            lotArea: 150,
            floorArea: 160,
            bedrooms: 5,
            bathrooms: 3,
            parking: 2,
            towerOrPhase: "Phase 1",
          },
        ],
      },
      landmarks: {
        create: [
          {
            name: "Liloan Municipal Hall",
            category: "Government",
            distance: "1 km",
          },
          {
            name: "Perpetual Help College of Cebu",
            category: "School",
            distance: "2 km",
          },
          {
            name: "Cebu City Proper",
            category: "City Center",
            distance: "18 km",
          },
          {
            name: "Mactan Cebu International Airport",
            category: "Airport",
            distance: "22 km",
          },
        ],
      },
    },
  });
  console.log("✅ 9/10 Havila Residences Liloan");

  // ─────────────────────────────────────────────────────────────────────────
  // 10. CONDO — Mivesa Garden Residences Studio (For Sale, Featured)
  // ─────────────────────────────────────────────────────────────────────────
  await prisma.property.create({
    data: {
      title: "Studio Unit at Mivesa Garden Residences",
      slug: "studio-mivesa-garden-residences-cebu",
      description:
        "A cozy and affordable studio unit at Mivesa Garden Residences in Kasambagan, Cebu City. One of the most garden-inspired condo developments in the metro — lush greenery, open spaces, and resort-style amenities. Perfect starter home for young professionals or a solid rental investment.",
      type: "CONDO",
      status: "FOR_SALE",
      listingType: "BRAND_NEW",
      isFeatured: true,
      address: "Mivesa Garden Residences, Kasambagan, Cebu City",
      city: "Cebu City",
      barangay: "Kasambagan",
      latitude: 10.335,
      longitude: 123.912,
      price: 2800000,
      floorArea: 28,
      bedrooms: 0,
      bathrooms: 1,
      parking: 0,
      floorLevel: "5",
      totalFloors: 12,
      isPagibigAccredited: true,
      isBankFinancingReady: true,
      isInHouseFinancing: true,
      developerName: "Primary Homes Inc.",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
            publicId: "seed/mivesa_1",
            isPrimary: true,
            order: 1,
            caption: "Studio unit interior",
          },
          {
            url: "https://images.unsplash.com/photo-1560185008-a33f5e2f8b5b?w=800",
            publicId: "seed/mivesa_2",
            isPrimary: false,
            order: 2,
            caption: "Garden amenity",
          },
          {
            url: "https://images.unsplash.com/photo-1551361415-69c87624334f?w=800",
            publicId: "seed/mivesa_3",
            isPrimary: false,
            order: 3,
            caption: "Swimming pool",
          },
        ],
      },
      amenities: {
        create: [
          { name: "Lap Pool", icon: "waves" },
          { name: "Garden & Jogging Path", icon: "tree-pine" },
          { name: "Gym", icon: "dumbbell" },
          { name: "24/7 Security", icon: "shield" },
          { name: "Mail Room", icon: "mail" },
          { name: "Bike Storage", icon: "bike" },
        ],
      },
      paymentSchemes: {
        create: [
          {
            type: "IN_HOUSE_FINANCING",
            description: "10% DP over 12 months — 0% interest",
            downPayment: 280000,
            monthlyAmount: 23300,
            terms: 12,
            interestRate: 0,
          },
          {
            type: "PAG_IBIG_FINANCING",
            description: "Pag-IBIG Fund — up to 30 years",
            downPayment: 280000,
            monthlyAmount: 14000,
            terms: 360,
            interestRate: 6.375,
          },
          {
            type: "BANK_FINANCING",
            description: "BDO / BPI — up to 20 years",
            downPayment: 280000,
            monthlyAmount: 17000,
            terms: 240,
            interestRate: 7.5,
          },
          {
            type: "SPOT_CASH",
            description: "3% discount for full cash payment",
          },
        ],
      },
      landmarks: {
        create: [
          { name: "SM City Cebu", category: "Mall", distance: "1.2 km" },
          {
            name: "Cebu Doctors' University Hospital",
            category: "Hospital",
            distance: "0.8 km",
          },
          {
            name: "University of Cebu Banilad",
            category: "School",
            distance: "0.5 km",
          },
          { name: "Ayala Center Cebu", category: "Mall", distance: "2 km" },
          {
            name: "Mactan Cebu International Airport",
            category: "Airport",
            distance: "14 km",
          },
        ],
      },
    },
  });
  console.log("✅ 10/10 Mivesa Garden Studio");

  console.log("\n🎉 Seeding complete! 10 properties created:");
  console.log("   1.  Avida Towers 2BR      — Condo · For Sale · Resale ⭐");
  console.log(
    "   2.  Consolacion House     — House & Lot · For Sale · Pag-IBIG ⭐",
  );
  console.log(
    "   3.  ATO Residences        — Condo · Pre-selling · 4 units ⭐",
  );
  console.log("   4.  Solinea Tower 3       — Condo · For Rent");
  console.log("   5.  Mactan Beachfront     — Beach/Vacation · For Sale ⭐");
  console.log(
    "   6.  Talisay Townhouse     — Townhouse · For Sale · Rent-to-Own",
  );
  console.log("   7.  Minglanilla Lot       — Lot Only · For Sale");
  console.log("   8.  IT Park Office        — Commercial · For Rent");
  console.log(
    "   9.  Havila Residences     — House & Lot · Pre-selling · 3 models",
  );
  console.log("   10. Mivesa Garden Studio  — Condo · For Sale · Brand New ⭐");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
