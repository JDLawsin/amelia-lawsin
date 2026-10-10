-- SEC-004: lock Prisma public tables from PostgREST (anon/authenticated).
-- New Prisma models in public must ENABLE ROW LEVEL SECURITY here (no GRANT to anon/authenticated).
-- Do not FORCE ROW LEVEL SECURITY — Prisma uses the table owner and must keep bypassing RLS.

-- Column limits matching public Zod schemas
ALTER TABLE "inquiries" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);
ALTER TABLE "inquiries" ALTER COLUMN "email" SET DATA TYPE VARCHAR(254);
ALTER TABLE "inquiries" ALTER COLUMN "phone" SET DATA TYPE VARCHAR(50);
ALTER TABLE "inquiries" ALTER COLUMN "propertyType" SET DATA TYPE VARCHAR(50);
ALTER TABLE "inquiries" ALTER COLUMN "propertyTitle" SET DATA TYPE VARCHAR(200);
ALTER TABLE "inquiries" ALTER COLUMN "propertySlug" SET DATA TYPE VARCHAR(200);
ALTER TABLE "inquiries" ALTER COLUMN "propertyPrice" SET DATA TYPE VARCHAR(100);
ALTER TABLE "inquiries" ALTER COLUMN "propertyLocation" SET DATA TYPE VARCHAR(200);
ALTER TABLE "inquiries" ALTER COLUMN "propertyStatus" SET DATA TYPE VARCHAR(50);
ALTER TABLE "inquiries" ALTER COLUMN "source" SET DATA TYPE VARCHAR(50);
ALTER TABLE "inquiries" ALTER COLUMN "message" SET DATA TYPE VARCHAR(2000);

ALTER TABLE "bookings" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);
ALTER TABLE "bookings" ALTER COLUMN "email" SET DATA TYPE VARCHAR(254);
ALTER TABLE "bookings" ALTER COLUMN "phone" SET DATA TYPE VARCHAR(50);
ALTER TABLE "bookings" ALTER COLUMN "propertyTitle" SET DATA TYPE VARCHAR(200);
ALTER TABLE "bookings" ALTER COLUMN "propertySlug" SET DATA TYPE VARCHAR(200);
ALTER TABLE "bookings" ALTER COLUMN "propertyLocation" SET DATA TYPE VARCHAR(200);
ALTER TABLE "bookings" ALTER COLUMN "notes" SET DATA TYPE VARCHAR(500);
ALTER TABLE "bookings" ALTER COLUMN "source" SET DATA TYPE VARCHAR(50);

ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "properties" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "property_units" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "property_images" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "amenities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "property_amenities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payment_schemes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "property_payment_schemes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "landmarks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "property_landmarks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "blogs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "blog_tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tags_on_blogs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inquiries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "form_write_events" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_insert_properties" ON "properties";
DROP POLICY IF EXISTS "admin_update_properties" ON "properties";
DROP POLICY IF EXISTS "users_insert_own_profile" ON "profiles";
DROP POLICY IF EXISTS "users_read_own_profile" ON "profiles";
DROP POLICY IF EXISTS "users_update_own_profile" ON "profiles";
DROP POLICY IF EXISTS "admin_manage_blogs" ON "blogs";
DROP POLICY IF EXISTS "public_read_published_blogs" ON "blogs";

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated;
-- Auth trigger lives on the hosted project only; Prisma's shadow DB does not create it.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'handle_new_user'
      AND pg_get_function_identity_arguments(p.oid) = ''
  ) THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC';
    EXECUTE 'REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated';
  END IF;
END $$;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon, authenticated;
