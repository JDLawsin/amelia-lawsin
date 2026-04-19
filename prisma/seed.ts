// run with: npx prisma db seed
import "dotenv/config";
import {
  ListingType,
  PaymentSchemeType,
  PrismaClient,
  PropertyStatus,
  PropertyType,
} from "@/app/generated/prisma/client";
import { faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

/**
 * -------------------------
 * HELPERS
 * -------------------------
 */

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-") +
  "-" +
  faker.string.alphanumeric(6);

const normalize = (v: string) => v.toLowerCase();

const randomSubset = <T>(arr: T[], min = 1, max = arr.length) => {
  const count = faker.number.int({ min, max });
  return faker.helpers.shuffle(arr).slice(0, count);
};

/**
 * -------------------------
 * MASTER DATA
 * -------------------------
 */

const AMENITIES = [
  { name: "Swimming Pool", icon: "waves" },
  { name: "Gym / Fitness Center", icon: "dumbbell" },
  { name: "24/7 Security", icon: "shield" },
  { name: "CCTV Surveillance", icon: "camera" },
  { name: "Lobby Lounge", icon: "sofa" },
  { name: "Parking", icon: "car" },
];

const LANDMARKS = [
  "Ayala Center Cebu",
  "SM City Cebu",
  "IT Park Cebu",
  "Fuente Osmeña Circle",
  "Cebu Business Park",
];

const PAYMENT_SCHEMES = [
  {
    type: PaymentSchemeType.SPOT_CASH,
    name: "Spot Cash",
    description: "Full payment upon signing",
  },
  {
    type: PaymentSchemeType.BANK_FINANCING,
    name: "Bank Financing",
    description: "Up to 20 years",
    downPayment: 500000,
    monthlyAmount: 25000,
    terms: 240,
    interestRate: 7.2,
  },
];

/**
 * -------------------------
 * BLOG TAGS
 * -------------------------
 */

const BLOG_TAGS = [
  "investment",
  "condo",
  "real-estate",
  "financing",
  "home-buying",
  "cebu",
];

/**
 * -------------------------
 * SEEDERS (MASTER TABLES)
 * -------------------------
 */

async function seedAmenities() {
  const map: Record<string, string> = {};

  for (const a of AMENITIES) {
    const record = await prisma.amenity.upsert({
      where: { nameNormalized: normalize(a.name) },
      update: {},
      create: {
        ...a,
        nameNormalized: normalize(a.name),
      },
    });

    map[a.name] = record.id;
  }

  return map;
}

async function seedLandmarks() {
  const map: Record<string, string> = {};

  for (const name of LANDMARKS) {
    const record = await prisma.landmark.upsert({
      where: { nameNormalized: normalize(name) },
      update: {},
      create: {
        name,
        nameNormalized: normalize(name),
      },
    });

    map[name] = record.id;
  }

  return map;
}

async function seedPaymentSchemes() {
  const map: Record<string, string> = {};

  for (const scheme of PAYMENT_SCHEMES) {
    const record = await prisma.paymentScheme.upsert({
      where: {
        type_name: {
          type: scheme.type,
          name: scheme.name,
        },
      },
      update: {},
      create: scheme,
    });

    map[scheme.name] = record.id;
  }

  return map;
}

async function seedBlogTags() {
  const map: Record<string, string> = {};

  for (const tag of BLOG_TAGS) {
    const record = await prisma.blogTag.upsert({
      where: { slug: tag },
      update: {},
      create: {
        name: tag,
        slug: tag,
      },
    });

    map[tag] = record.id;
  }

  return map;
}

/**
 * -------------------------
 * GENERATORS
 * -------------------------
 */

function generateBlogContent() {
  return {
    blocks: Array.from({ length: 5 }).map(() => ({
      type: "paragraph",
      data: {
        text: faker.lorem.paragraph(),
      },
    })),
  };
}

function generateBlog() {
  const title = faker.company.catchPhrase();

  return {
    title,
    slug: slugify(title),
    excerpt: faker.lorem.sentences(2),
    content: generateBlogContent(),
    coverImage: faker.image.urlPicsumPhotos({ width: 800, height: 400 }),
    isPublished: true,
    publishedAt: new Date(),
    metaTitle: title,
    metaDescription: faker.lorem.sentence(),
  };
}

function generateProperty() {
  const title = faker.company.name() + " Residences";

  return {
    title,
    slug: slugify(title),
    description: faker.lorem.paragraph(),

    type: faker.helpers.arrayElement([
      PropertyType.CONDO,
      PropertyType.TOWNHOUSE,
      PropertyType.HOUSE_AND_LOT,
    ]),

    status: faker.helpers.arrayElement([
      PropertyStatus.FOR_SALE,
      PropertyStatus.PRE_SELLING,
    ]),

    listingType: ListingType.BRAND_NEW,

    isFeatured: faker.datatype.boolean(),

    address: faker.location.streetAddress(),
    city: "Cebu City",
    barangay: faker.location.street(),

    price: faker.number.int({ min: 1_500_000, max: 8_000_000 }),

    bedrooms: faker.number.int({ min: 1, max: 4 }),
    bathrooms: faker.number.int({ min: 1, max: 3 }),
    parking: faker.number.int({ min: 0, max: 2 }),

    floorArea: faker.number.int({ min: 20, max: 120 }),

    isBankFinancingReady: true,
    isPagibigAccredited: faker.datatype.boolean(),
  };
}

/**
 * -------------------------
 * PROPERTY SEEDER
 * -------------------------
 */

async function seedProperties(
  amenitiesMap: Record<string, string>,
  schemesMap: Record<string, string>,
  landmarksMap: Record<string, string>,
) {
  const PROPERTY_COUNT = 30;

  const amenityKeys = Object.keys(amenitiesMap);
  const schemeKeys = Object.keys(schemesMap);
  const landmarkKeys = Object.keys(landmarksMap);

  for (let i = 0; i < PROPERTY_COUNT; i++) {
    const property = generateProperty();

    const selectedAmenities = randomSubset(amenityKeys, 1, 4);
    const selectedSchemes = randomSubset(schemeKeys, 1, 2);
    const selectedLandmarks = randomSubset(landmarkKeys, 1, 3);

    await prisma.property.create({
      data: {
        ...property,

        images: {
          create: Array.from({ length: 3 }).map((_, i) => ({
            url: faker.image.urlPicsumPhotos(),
            publicId: faker.string.uuid(),
            isPrimary: i === 0,
            order: i,
          })),
        },

        units: {
          create: Array.from({ length: 2 }).map(() => ({
            label: faker.helpers.arrayElement(["Studio", "1BR", "2BR"]),
            price: faker.number.int({ min: 1_500_000, max: 5_000_000 }),
            bedrooms: faker.number.int({ min: 0, max: 2 }),
            bathrooms: 1,
            floorArea: faker.number.int({ min: 20, max: 60 }),
          })),
        },

        amenities: {
          create: selectedAmenities.map((name) => ({
            amenity: { connect: { id: amenitiesMap[name] } },
          })),
        },

        paymentSchemes: {
          create: selectedSchemes.map((name) => ({
            paymentScheme: { connect: { id: schemesMap[name] } },
          })),
        },

        landmarks: {
          create: selectedLandmarks.map((name) => ({
            landmark: { connect: { id: landmarksMap[name] } },
            distance: `${faker.number.int({ min: 1, max: 10 })} km`,
          })),
        },
      },
    });
  }
}

/**
 * -------------------------
 * BLOG SEEDER
 * -------------------------
 */

async function seedBlogs(tagsMap: Record<string, string>) {
  const BLOG_COUNT = 20;
  const tagKeys = Object.keys(tagsMap);

  for (let i = 0; i < BLOG_COUNT; i++) {
    const blog = generateBlog();
    const selectedTags = randomSubset(tagKeys, 1, 3);

    await prisma.blog.create({
      data: {
        ...blog,
        tags: {
          create: selectedTags.map((tag) => ({
            tag: {
              connect: { id: tagsMap[tag] },
            },
          })),
        },
      },
    });
  }
}

/**
 * -------------------------
 * MAIN
 * -------------------------
 */

async function main() {
  console.log("🌱 Seeding database...");

  const amenitiesMap = await seedAmenities();
  const schemesMap = await seedPaymentSchemes();
  const landmarksMap = await seedLandmarks();
  const tagsMap = await seedBlogTags();

  await seedProperties(amenitiesMap, schemesMap, landmarksMap);
  await seedBlogs(tagsMap);

  console.log("✅ Done seeding.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
