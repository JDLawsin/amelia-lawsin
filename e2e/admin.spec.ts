import { createServerClient } from "@supabase/ssr";
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import {
  createPropertyFixture,
  removePropertyFixture,
  usesLocalDatabaseFixtures,
} from "./helpers/database";

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const draftSlug = process.env.E2E_DRAFT_PROPERTY_SLUG;
const draftTitle = process.env.E2E_DRAFT_PROPERTY_TITLE;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";
const allowWrites = process.env.E2E_ALLOW_WRITES === "1";

type AuthCookie = {
  name: string;
  value: string;
  options?: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: boolean | string;
  };
};

const normalizeSameSite = (
  value: boolean | string | undefined,
): "Strict" | "Lax" | "None" | undefined => {
  if (!value) return undefined;
  if (value === true) return "Strict";
  const normalized = value.toLowerCase();
  if (normalized === "strict") return "Strict";
  if (normalized === "none") return "None";
  return "Lax";
};

const authenticateAdmin = async (context: BrowserContext) => {
  let authCookies: AuthCookie[] = [];
  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll: () => authCookies,
      setAll: (cookies) => {
        authCookies = cookies;
      },
    },
  });

  const { error } = await supabase.auth.signInWithPassword({
    email: adminEmail!,
    password: adminPassword!,
  });
  if (error) throw new Error(`E2E admin sign-in failed: ${error.message}`);

  await context.addCookies(
    authCookies.map(({ name, value, options }) => ({
      name,
      value,
      url: baseURL,
      httpOnly: options?.httpOnly,
      secure: options?.secure,
      sameSite: normalizeSameSite(options?.sameSite),
    })),
  );
};

const findDraftRow = async (page: Page, title: string) => {
  await page.goto(`/admin/properties?q=${encodeURIComponent(title)}`);
  const row = page.getByRole("row").filter({ hasText: title });
  await expect(row).toHaveCount(1);
  return row;
};

test("an admin can publish and unpublish a listing", async ({ context, page }) => {
  test.skip(
    !allowWrites ||
      !adminEmail ||
      !adminPassword ||
      (!usesLocalDatabaseFixtures && (!draftSlug || !draftTitle)) ||
      !supabaseUrl ||
      !supabaseAnonKey,
    "Set E2E_ALLOW_WRITES=1, admin credentials, and deployed fixture variables when needed.",
  );

  const fixture = usesLocalDatabaseFixtures
    ? await createPropertyFixture(false)
    : null;
  const slug = fixture?.slug ?? draftSlug!;
  const title = fixture?.title ?? draftTitle!;

  let needsDraftRestore = false;

  try {
    await authenticateAdmin(context);
    let row = await findDraftRow(page, title);
    await expect(row.getByText("Draft", { exact: true })).toBeVisible();
    await row.getByRole("button", { name: "Actions" }).click();
    await page.getByRole("menuitem", { name: "Publish", exact: true }).click();
    needsDraftRestore = true;
    await expect(page.getByText("Property published.")).toBeVisible();

    const publicPage = await context.newPage();
    try {
      const publishedResponse = await publicPage.goto(`/properties/${slug}`);
      expect(publishedResponse?.status()).toBe(200);
      await expect(
        publicPage.getByRole("heading", { name: title, level: 1 }),
      ).toBeVisible();
    } finally {
      await publicPage.close();
    }

    row = await findDraftRow(page, title);
    await expect(row.getByText("Published", { exact: true })).toBeVisible();
    await row.getByRole("button", { name: "Actions" }).click();
    await page.getByRole("menuitem", { name: "Unpublish", exact: true }).click();
    await expect(page.getByText("Property unpublished.")).toBeVisible();
    needsDraftRestore = false;

    const hiddenPage = await context.newPage();
    try {
      await hiddenPage.goto(`/properties/${slug}`);
      await expect(
        hiddenPage.getByRole("heading", { name: "Property not found" }),
      ).toBeVisible();
      await expect(hiddenPage.getByRole("heading", { name: title })).toHaveCount(
        0,
      );
    } finally {
      await hiddenPage.close();
    }
  } finally {
    try {
      if (needsDraftRestore) {
        const row = await findDraftRow(page, title);
        await row.getByRole("button", { name: "Actions" }).click();
        const unpublish = page.getByRole("menuitem", {
          name: "Unpublish",
          exact: true,
        });
        if (await unpublish.isVisible()) await unpublish.click();
      }
    } finally {
      if (fixture) await removePropertyFixture(fixture.id);
    }
  }
});
