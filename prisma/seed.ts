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
  await prisma.tagsOnBlogs.deleteMany();
  await prisma.blogTag.deleteMany();
  await prisma.blog.deleteMany();
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

  // ─────────────────────────────────────────────────────────────────────────
  // BLOGS — Create tags first, then posts
  // ─────────────────────────────────────────────────────────────────────────

  const tagOfw = await prisma.blogTag.create({
    data: { name: "OFW Guide", slug: "ofw-guide" },
  });
  const tagFinancing = await prisma.blogTag.create({
    data: { name: "Financing", slug: "financing" },
  });
  const tagInvesting = await prisma.blogTag.create({
    data: { name: "Investment", slug: "investment" },
  });
  const tagCebu = await prisma.blogTag.create({
    data: { name: "Cebu Real Estate", slug: "cebu-real-estate" },
  });
  const tagFirstHome = await prisma.blogTag.create({
    data: { name: "First-time Buyer", slug: "first-time-buyer" },
  });
  const tagTips = await prisma.blogTag.create({
    data: { name: "Buying Tips", slug: "buying-tips" },
  });

  console.log("✅ Blog tags created");

  // ── Blog 1 ────────────────────────────────────────────────────────────────

  await prisma.blog.create({
    data: {
      title: "Best Condos to Buy in Cebu 2025: A Complete Guide for OFWs",
      slug: "best-condos-to-buy-in-cebu-2025",
      excerpt:
        "Planning to invest in a condo in Cebu but not sure where to start? This guide breaks down the top condo developments across Cebu City, Mandaue, and Lapu-Lapu — with price ranges, location advantages, and financing options perfect for OFWs.",
      coverImage:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      coverPublicId: "seed/blog_condos_cebu",
      isPublished: true,
      isAiGenerated: false,
      publishedAt: new Date("2025-03-10"),
      metaTitle: "Best Condos to Buy in Cebu 2025 — OFW Buying Guide",
      metaDescription:
        "Discover the top condo developments in Cebu City, Mandaue, and Lapu-Lapu. Price ranges, locations, and financing options for OFW buyers.",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [
              {
                type: "text",
                text: "Why Cebu is the Top Choice for OFW Real Estate Investment",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Cebu has consistently ranked as one of the Philippines' fastest-growing cities outside Metro Manila. For OFWs looking to invest their hard-earned money, the Cebu property market offers a compelling mix of affordability, strong rental demand, and steady appreciation.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Top Condo Locations in Cebu" }],
          },
          {
            type: "heading",
            attrs: { level: 3 },
            content: [{ type: "text", text: "1. IT Park, Lahug" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "IT Park is the heart of Cebu's BPO industry. Condos here command premium prices but offer the highest rental yields — typically ₱25,000 to ₱45,000 per month for a 1-2 bedroom unit. Developments like Avida Towers and 38 Park Avenue are perennial favorites.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 3 },
            content: [{ type: "text", text: "2. Cebu Business Park (Ayala)" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Adjacent to Ayala Center Cebu, this area is ideal for professionals and expats. Units at Solinea, The Alcoves, and Park Centrale regularly appreciate 5-8% annually. Prices range from ₱4M to ₱15M depending on floor and unit size.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 3 },
            content: [{ type: "text", text: "3. Mandaue City" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "More affordable than Cebu City proper, Mandaue is emerging as a strong investment location. Pre-selling condos start at ₱3.5M and benefit from proximity to both Cebu City and Mactan Airport.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Financing Options for OFWs" }],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Pag-IBIG Fund: Up to ₱6.5M loanable at 6.375% interest. Best for OFWs who are active Pag-IBIG members.",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Bank Financing: BDO, BPI, and Metrobank offer up to 80% financing with 20-year terms.",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "In-house Financing: Offered directly by developers with flexible terms and lower documentary requirements.",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Ready to Invest?" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Reach out to Amelia Lawsin, a licensed real estate Agent in Cebu, to get personalized recommendations based on your budget and goals. She specializes in assisting OFWs through the entire buying process — from shortlisting properties to processing your financing.",
              },
            ],
          },
        ],
      },
      tags: {
        create: [
          { tag: { connect: { id: tagOfw.id } } },
          { tag: { connect: { id: tagCebu.id } } },
          { tag: { connect: { id: tagInvesting.id } } },
        ],
      },
    },
  });
  console.log("✅ Blog 1/5 — Best Condos in Cebu 2025");

  // ── Blog 2 ────────────────────────────────────────────────────────────────

  await prisma.blog.create({
    data: {
      title:
        "Pag-IBIG vs Bank Loan: Which is Better for Buying a Home in Cebu?",
      slug: "pag-ibig-vs-bank-loan-cebu",
      excerpt:
        "One of the most common questions from first-time homebuyers is: should I use Pag-IBIG or a bank loan? We break down interest rates, eligibility, loanable amounts, and which option makes more sense depending on your situation.",
      coverImage:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
      coverPublicId: "seed/blog_financing",
      isPublished: true,
      isAiGenerated: false,
      publishedAt: new Date("2025-03-05"),
      metaTitle:
        "Pag-IBIG vs Bank Loan for Home Buying in Cebu — Full Comparison",
      metaDescription:
        "Compare Pag-IBIG and bank financing for buying a home in Cebu. Interest rates, terms, eligibility requirements and which is better for you.",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [
              {
                type: "text",
                text: "The Two Main Financing Options in the Philippines",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "When buying a home in Cebu, most buyers choose between two main financing routes: the Pag-IBIG Housing Loan or a traditional bank loan. Both have their pros and cons, and the right choice depends entirely on your situation.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Pag-IBIG Housing Loan" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "The Pag-IBIG Fund (HDMF) offers the most affordable interest rates in the Philippines. As of 2025, the rate starts at 6.375% per annum for a 30-year term — significantly lower than most bank rates.",
              },
            ],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Maximum loanable amount: ₱6,500,000",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Interest rate: 6.375% to 10% depending on term",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Maximum term: 30 years" }],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Eligibility: Active Pag-IBIG member with 24 monthly contributions",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Bank Housing Loan" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Bank loans offer higher loanable amounts and can cover properties not accredited with Pag-IBIG. BDO, BPI, and Metrobank are the most popular choices among Cebu property buyers.",
              },
            ],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Maximum loanable amount: Up to 80% of appraised value (no ceiling)",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Interest rate: 7.5% to 9% per annum (re-priced every 1-5 years)",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", text: "Maximum term: 20-25 years" },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Eligibility: Regular employment or business with at least 2 years operation",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Our Recommendation" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "For most Filipino buyers and OFWs purchasing a home priced below ₱6.5M, Pag-IBIG is almost always the better choice due to its lower interest rate and longer repayment terms. For high-value properties above ₱6.5M, bank financing becomes the necessary route.",
              },
            ],
          },
        ],
      },
      tags: {
        create: [
          { tag: { connect: { id: tagFinancing.id } } },
          { tag: { connect: { id: tagFirstHome.id } } },
          { tag: { connect: { id: tagOfw.id } } },
        ],
      },
    },
  });
  console.log("✅ Blog 2/5 — Pag-IBIG vs Bank Loan");

  // ── Blog 3 ────────────────────────────────────────────────────────────────

  await prisma.blog.create({
    data: {
      title: "Pre-selling vs Ready for Occupancy (RFO): What You Need to Know",
      slug: "pre-selling-vs-rfo-cebu",
      excerpt:
        "Should you buy a pre-selling condo or an RFO unit? Both have their pros and cons depending on your timeline, budget, and investment goals. This article helps you decide which is right for you.",
      coverImage:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      coverPublicId: "seed/blog_preselling_rfo",
      isPublished: true,
      isAiGenerated: false,
      publishedAt: new Date("2025-02-28"),
      metaTitle:
        "Pre-selling vs RFO Properties in Cebu — Which Should You Buy?",
      metaDescription:
        "Understand the difference between pre-selling and ready-for-occupancy condos in Cebu. Compare pricing, risks, and benefits before buying.",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "What is Pre-selling?" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Pre-selling refers to properties that are sold before construction is completed — sometimes even before ground is broken. Buyers commit at today's price with the expectation that the property will be worth more by turnover date.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [
              { type: "text", text: "What is RFO (Ready for Occupancy)?" },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "RFO properties are fully constructed and ready to move into immediately. You can inspect the actual unit before buying, and there is no waiting period. RFO units are typically 15-30% more expensive than the same unit at pre-selling stage.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Pre-selling: Pros and Cons" }],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Pros: ",
                      },
                      {
                        type: "text",
                        text: "Lower entry price, flexible payment during construction, potential for capital appreciation by turnover",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Cons: ",
                      },
                      {
                        type: "text",
                        text: "2-4 year wait, construction delays are common, finished product may differ from showroom",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "RFO: Pros and Cons" }],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Pros: ",
                      },
                      {
                        type: "text",
                        text: "Move in immediately, see exactly what you get, can rent out right away for income",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Cons: ",
                      },
                      {
                        type: "text",
                        text: "Higher price, full bank financing required upfront, less flexibility in payment",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Which is Right for You?" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "If you are an OFW or investor with a 3-5 year horizon and want to maximize appreciation, pre-selling is a smart choice. If you need to move in soon or want to generate rental income immediately, RFO is the way to go. The best approach is to consult a trusted agent who knows both the developer reputation and the local market.",
              },
            ],
          },
        ],
      },
      tags: {
        create: [
          { tag: { connect: { id: tagInvesting.id } } },
          { tag: { connect: { id: tagCebu.id } } },
          { tag: { connect: { id: tagTips.id } } },
        ],
      },
    },
  });
  console.log("✅ Blog 3/5 — Pre-selling vs RFO");

  // ── Blog 4 ────────────────────────────────────────────────────────────────

  await prisma.blog.create({
    data: {
      title: "10 Things First-Time Homebuyers in Cebu Need to Know",
      slug: "first-time-homebuyer-guide-cebu",
      excerpt:
        "Buying your first home is one of the biggest financial decisions you will ever make. Before you sign anything, here are 10 essential things every first-time homebuyer in Cebu should know.",
      coverImage:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
      coverPublicId: "seed/blog_firsttime",
      isPublished: true,
      isAiGenerated: false,
      publishedAt: new Date("2025-02-15"),
      metaTitle:
        "10 Things First-Time Homebuyers in Cebu Must Know — 2025 Guide",
      metaDescription:
        "Essential guide for first-time homebuyers in Cebu. Learn about down payments, financing, legal documents, and common mistakes to avoid.",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Buying your first home is exciting but can feel overwhelming. Here are 10 things you absolutely need to know before making the biggest purchase of your life.",
              },
            ],
          },
          {
            type: "orderedList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Get your finances in order first. ",
                      },
                      {
                        type: "text",
                        text: "Check your credit history, compute your monthly income, and determine how much you can afford. A general rule: your monthly amortization should not exceed 30% of your gross monthly income.",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Understand all the costs involved. ",
                      },
                      {
                        type: "text",
                        text: "The purchase price is just the beginning. Budget for transfer taxes (1.5%), documentary stamps (1.5%), registration fees, notarial fees, and move-in costs.",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Always verify the title. ",
                      },
                      {
                        type: "text",
                        text: "Request a certified true copy of the Transfer Certificate of Title (TCT) from the Registry of Deeds. Make sure it is clean — no liens, encumbrances, or adverse claims.",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Work with a licensed agent. ",
                      },
                      {
                        type: "text",
                        text: "A PRC-licensed real estate agent represents your interests, not the developer's. Their commission is typically paid by the seller — so their help costs you nothing.",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Check the developer's track record. ",
                      },
                      {
                        type: "text",
                        text: "For pre-selling properties, research the developer's history of delivering on time. Ask for completed projects you can visit.",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Read the contract carefully. ",
                      },
                      {
                        type: "text",
                        text: "Specifically look at penalty clauses, cancellation terms, and what happens if the developer delays turnover. Never sign anything you don't fully understand.",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Location is everything. ",
                      },
                      {
                        type: "text",
                        text: "Consider proximity to your workplace, schools, hospitals, and public transport. Visit the area at different times of day before committing.",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Pre-qualify for a loan before you shop. ",
                      },
                      {
                        type: "text",
                        text: "Get a pre-approval from Pag-IBIG or your preferred bank. This tells you exactly how much you can borrow and speeds up the process when you find the right property.",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Don't skip the inspection. ",
                      },
                      {
                        type: "text",
                        text: "For RFO units, always inspect before signing the acceptance form. Document any defects with photos and request repairs in writing before moving in.",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Take your time. ",
                      },
                      {
                        type: "text",
                        text: "Real estate is not a decision to rush. A good property will still be there tomorrow. Never let anyone pressure you into signing on the spot.",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      tags: {
        create: [
          { tag: { connect: { id: tagFirstHome.id } } },
          { tag: { connect: { id: tagTips.id } } },
          { tag: { connect: { id: tagCebu.id } } },
        ],
      },
    },
  });
  console.log("✅ Blog 4/5 — First-time Homebuyer Guide");

  // ── Blog 5 ────────────────────────────────────────────────────────────────

  await prisma.blog.create({
    data: {
      title:
        "Why Mactan Island is the Best Place to Invest in Beach Property in Cebu",
      slug: "mactan-island-beach-property-investment-cebu",
      excerpt:
        "Mactan Island is home to world-class resorts, the Cebu international airport, and a thriving tourism industry. Here is why savvy investors are snapping up beachfront properties before prices climb further.",
      coverImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      coverPublicId: "seed/blog_mactan",
      isPublished: true,
      isAiGenerated: false,
      publishedAt: new Date("2025-02-01"),
      metaTitle:
        "Mactan Island Beach Property Investment Guide — Cebu Real Estate",
      metaDescription:
        "Why Mactan Island is the top beach property investment in Cebu. Tourism growth, Airbnb potential, and what to look for when buying beachfront.",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Why Mactan Stands Out" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Mactan Island occupies a unique position in Philippine real estate — it is simultaneously a luxury resort destination, an international airport hub, and a growing residential community. This combination makes it one of the most compelling investment locations outside Metro Manila.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Tourism is Driving Demand" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Mactan is home to Shangri-La, Crimson Resort, and Plantation Bay — some of the Philippines' most recognized resort brands. International arrivals at Mactan Cebu International Airport have grown consistently, and the tourism infrastructure continues to improve with new hotels and resort developments.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [
              { type: "text", text: "Airbnb and Short-Term Rental Potential" },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Beachfront properties in Mactan are perfectly positioned for short-term rentals. A well-positioned beachfront villa or vacation home can command ₱15,000 to ₱50,000 per night on peak seasons. Tourism-zoned lots allow for resort development and commercial use.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "What to Look For When Buying" }],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Verify the property is tourism-zoned if you intend to operate a commercial accommodation",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Confirm beach frontage measurement and any reclamation restrictions",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Check for DENR clearances especially for waterfront properties",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Assess flood risk and storm surge exposure",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Work with a agent who knows the local area well",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [
              { type: "text", text: "Interested in Mactan Beach Properties?" },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Amelia Lawsin has listings in Mactan and deep knowledge of the Cebu coastal property market. Get in touch to explore available beachfront lots and vacation properties.",
              },
            ],
          },
        ],
      },
      tags: {
        create: [
          { tag: { connect: { id: tagInvesting.id } } },
          { tag: { connect: { id: tagCebu.id } } },
          { tag: { connect: { id: tagTips.id } } },
        ],
      },
    },
  });
  console.log("✅ Blog 5/5 — Mactan Beach Investment");

  console.log("\n🎉 Seeding complete!");
  console.log("\n📦 Properties (10):");
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
  console.log("\n📝 Blogs (5):");
  console.log("   1.  Best Condos in Cebu 2025 — OFW Guide");
  console.log("   2.  Pag-IBIG vs Bank Loan — Financing");
  console.log("   3.  Pre-selling vs RFO — Investment");
  console.log("   4.  10 Things First-Time Buyers Need to Know — Buying Tips");
  console.log("   5.  Mactan Beach Investment — Cebu Real Estate");
  console.log(
    "\n🏷️  Blog Tags (6): OFW Guide, Financing, Investment, Cebu Real Estate, First-time Buyer, Buying Tips",
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
