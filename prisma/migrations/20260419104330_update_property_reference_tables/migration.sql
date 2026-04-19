/*
  Warnings:

  - You are about to drop the column `icon` on the `property_amenities` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `property_amenities` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `property_landmarks` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `property_landmarks` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `property_payment_schemes` table. All the data in the column will be lost.
  - You are about to drop the column `downPayment` on the `property_payment_schemes` table. All the data in the column will be lost.
  - You are about to drop the column `interestRate` on the `property_payment_schemes` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyAmount` on the `property_payment_schemes` table. All the data in the column will be lost.
  - You are about to drop the column `terms` on the `property_payment_schemes` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `property_payment_schemes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[propertyId,amenityId]` on the table `property_amenities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[propertyId,landmarkId]` on the table `property_landmarks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[propertyId,paymentSchemeId]` on the table `property_payment_schemes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amenityId` to the `property_amenities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landmarkId` to the `property_landmarks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentSchemeId` to the `property_payment_schemes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "property_amenities" DROP COLUMN "icon",
DROP COLUMN "name",
ADD COLUMN     "amenityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "property_landmarks" DROP COLUMN "category",
DROP COLUMN "name",
ADD COLUMN     "landmarkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "property_payment_schemes" DROP COLUMN "description",
DROP COLUMN "downPayment",
DROP COLUMN "interestRate",
DROP COLUMN "monthlyAmount",
DROP COLUMN "terms",
DROP COLUMN "type",
ADD COLUMN     "paymentSchemeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "amenities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameNormalized" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_schemes" (
    "id" TEXT NOT NULL,
    "type" "PaymentSchemeType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "downPayment" DOUBLE PRECISION,
    "monthlyAmount" DOUBLE PRECISION,
    "terms" INTEGER,
    "interestRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_schemes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landmarks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameNormalized" TEXT NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "landmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "amenities_nameNormalized_key" ON "amenities"("nameNormalized");

-- CreateIndex
CREATE UNIQUE INDEX "payment_schemes_type_name_key" ON "payment_schemes"("type", "name");

-- CreateIndex
CREATE UNIQUE INDEX "landmarks_nameNormalized_key" ON "landmarks"("nameNormalized");

-- CreateIndex
CREATE INDEX "properties_city_idx" ON "properties"("city");

-- CreateIndex
CREATE INDEX "properties_type_status_idx" ON "properties"("type", "status");

-- CreateIndex
CREATE INDEX "properties_isFeatured_idx" ON "properties"("isFeatured");

-- CreateIndex
CREATE INDEX "properties_deletedAt_idx" ON "properties"("deletedAt");

-- CreateIndex
CREATE INDEX "property_amenities_propertyId_idx" ON "property_amenities"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "property_amenities_propertyId_amenityId_key" ON "property_amenities"("propertyId", "amenityId");

-- CreateIndex
CREATE INDEX "property_landmarks_propertyId_idx" ON "property_landmarks"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "property_landmarks_propertyId_landmarkId_key" ON "property_landmarks"("propertyId", "landmarkId");

-- CreateIndex
CREATE INDEX "property_payment_schemes_propertyId_idx" ON "property_payment_schemes"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "property_payment_schemes_propertyId_paymentSchemeId_key" ON "property_payment_schemes"("propertyId", "paymentSchemeId");

-- AddForeignKey
ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_payment_schemes" ADD CONSTRAINT "property_payment_schemes_paymentSchemeId_fkey" FOREIGN KEY ("paymentSchemeId") REFERENCES "payment_schemes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_landmarks" ADD CONSTRAINT "property_landmarks_landmarkId_fkey" FOREIGN KEY ("landmarkId") REFERENCES "landmarks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
