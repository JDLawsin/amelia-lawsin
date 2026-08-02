-- AlterTable
ALTER TABLE "inquiries" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "respondedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "inquiries_isRead_idx" ON "inquiries"("isRead");

-- CreateIndex
CREATE INDEX "inquiries_isArchived_idx" ON "inquiries"("isArchived");
