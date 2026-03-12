-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('CONDO', 'HOUSE_AND_LOT', 'LOT_ONLY', 'TOWNHOUSE', 'COMMERCIAL', 'BEACH_VACATION');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('FOR_SALE', 'FOR_RENT', 'PRE_SELLING', 'SOLD', 'RENTED');

-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('BRAND_NEW', 'RESALE');

-- CreateEnum
CREATE TYPE "PaymentSchemeType" AS ENUM ('SPOT_CASH', 'IN_HOUSE_FINANCING', 'BANK_FINANCING', 'PAG_IBIG_FINANCING', 'RENT_TO_OWN');

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "PropertyType" NOT NULL,
    "status" "PropertyStatus" NOT NULL,
    "listingType" "ListingType" NOT NULL DEFAULT 'BRAND_NEW',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Cebu City',
    "barangay" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "priceLabel" TEXT,
    "lotArea" DOUBLE PRECISION,
    "floorArea" DOUBLE PRECISION,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "parking" INTEGER DEFAULT 0,
    "monthlyRent" DOUBLE PRECISION,
    "associationDue" DOUBLE PRECISION,
    "floorLevel" TEXT,
    "totalFloors" INTEGER,
    "beachFrontage" DOUBLE PRECISION,
    "hasDock" BOOLEAN NOT NULL DEFAULT false,
    "isTourismZoned" BOOLEAN NOT NULL DEFAULT false,
    "isAirbnbReady" BOOLEAN NOT NULL DEFAULT false,
    "isPagibigAccredited" BOOLEAN NOT NULL DEFAULT false,
    "isBankFinancingReady" BOOLEAN NOT NULL DEFAULT false,
    "isInHouseFinancing" BOOLEAN NOT NULL DEFAULT false,
    "isRentToOwn" BOOLEAN NOT NULL DEFAULT false,
    "developerName" TEXT,
    "projectPhase" TEXT,
    "expectedTurnover" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_units" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "status" "PropertyStatus",
    "price" DOUBLE PRECISION,
    "priceLabel" TEXT,
    "floorArea" DOUBLE PRECISION,
    "lotArea" DOUBLE PRECISION,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "parking" INTEGER DEFAULT 0,
    "towerOrPhase" TEXT,
    "floorPlanImage" TEXT,
    "floorPlanPublicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_images" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_amenities" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "property_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_payment_schemes" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "type" "PaymentSchemeType" NOT NULL,
    "description" TEXT,
    "downPayment" DOUBLE PRECISION,
    "monthlyAmount" DOUBLE PRECISION,
    "terms" INTEGER,
    "interestRate" DOUBLE PRECISION,

    CONSTRAINT "property_payment_schemes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_landmarks" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "distance" TEXT,

    CONSTRAINT "property_landmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "excerpt" TEXT NOT NULL,
    "coverImage" TEXT,
    "coverPublicId" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isAiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "metaTitle" TEXT,
    "metaDescription" TEXT,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "blog_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags_on_blogs" (
    "blogId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "tags_on_blogs_pkey" PRIMARY KEY ("blogId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "properties_slug_key" ON "properties"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tags_name_key" ON "blog_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tags_slug_key" ON "blog_tags"("slug");

-- AddForeignKey
ALTER TABLE "property_units" ADD CONSTRAINT "property_units_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_payment_schemes" ADD CONSTRAINT "property_payment_schemes_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_landmarks" ADD CONSTRAINT "property_landmarks_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags_on_blogs" ADD CONSTRAINT "tags_on_blogs_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags_on_blogs" ADD CONSTRAINT "tags_on_blogs_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "blog_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
