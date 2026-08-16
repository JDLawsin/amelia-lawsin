-- CreateTable
CREATE TABLE "form_write_events" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_write_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "form_write_events_ip_createdAt_idx" ON "form_write_events"("ip", "createdAt");

-- DropIndex
DROP INDEX "bookings_scheduledAt_key";

-- Confirmed slots stay exclusive; PENDING requests do not lock the calendar.
CREATE UNIQUE INDEX "bookings_confirmed_scheduledAt_key" ON "bookings"("scheduledAt") WHERE status = 'CONFIRMED';

ALTER TABLE "form_write_events" ENABLE ROW LEVEL SECURITY;
