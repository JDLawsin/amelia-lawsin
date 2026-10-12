import { randomUUID } from "node:crypto";
import { Pool } from "pg";

const connectionString = process.env.E2E_DATABASE_URL;

export const usesLocalDatabaseFixtures =
  Boolean(connectionString) &&
  !process.env.PLAYWRIGHT_BASE_URL &&
  process.env.E2E_ALLOW_WRITES === "1";

const pool = connectionString
  ? new Pool({ connectionString, allowExitOnIdle: true })
  : null;

const database = () => {
  if (!pool) {
    throw new Error("E2E_DATABASE_URL is required for local E2E fixtures.");
  }
  return pool;
};

export const createPropertyFixture = async (isPublished: boolean) => {
  const id = randomUUID();
  const visibility = isPublished ? "Published" : "Draft";
  const title = `E2E ${visibility} Property ${id.slice(0, 8)}`;
  const slug = `e2e-${visibility.toLowerCase()}-${id}`;

  await database().query(
    `INSERT INTO properties
      (id, title, slug, description, type, status, "listingType", "isPublished", address, city, price, "updatedAt")
     VALUES ($1, $2, $3, $4, 'CONDO', 'FOR_SALE', 'BRAND_NEW', $5, $6, $7, $8, NOW())`,
    [
      id,
      title,
      slug,
      "Dedicated Playwright property fixture.",
      isPublished,
      "E2E Test Address",
      "Cebu City",
      1_000_000,
    ],
  );

  return { id, title, slug };
};

export const removePropertyFixture = async (id: string) => {
  await database().query("DELETE FROM properties WHERE id = $1", [id]);
};

export const findInquiryFixture = async (email: string) => {
  const result = await database().query<{
    name: string;
    source: string;
  }>(
    `SELECT name, source FROM inquiries WHERE email = $1 ORDER BY "createdAt" DESC LIMIT 1`,
    [email],
  );
  return result.rows[0] ?? null;
};

export const removeInquiryFixture = async (email: string) => {
  await database().query("DELETE FROM inquiries WHERE email = $1", [email]);
};

export const findBookingFixture = async (email: string) => {
  const result = await database().query<{
    name: string;
    source: string;
    status: string;
  }>(
    `SELECT name, source, status FROM bookings WHERE email = $1 ORDER BY "createdAt" DESC LIMIT 1`,
    [email],
  );
  return result.rows[0] ?? null;
};

export const removeBookingFixture = async (email: string) => {
  await database().query("DELETE FROM bookings WHERE email = $1", [email]);
};

export const removeRateLimitFixture = async (ip: string) => {
  await database().query('DELETE FROM form_write_events WHERE ip = $1', [ip]);
};
