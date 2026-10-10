-- AlterTable
ALTER TABLE "properties" ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- Backfill existing listings so current inventory stays live
UPDATE "properties" SET "isPublished" = true;

-- CreateIndex
CREATE INDEX "properties_isPublished_idx" ON "properties"("isPublished");
