import { createServerClient } from "@supabase/ssr";
import { expect, test, type BrowserContext, type Page } from "@playwright/test";

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const draftSlug = process.env.E2E_DRAFT_PROPERTY_SLUG;
const draftTitle = process.env.E2E_DRAFT_PROPERTY_TITLE;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

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

const findDraftRow = async (page: Page) => {
  await page.goto(`/admin/properties?q=${encodeURIComponent(draftTitle!)}`);
  const row = page.getByRole("row").filter({ hasText: draftTitle! });
  await expect(row).toHaveCount(1);
  return row;
};

test("an admin can publish and unpublish a listing", async ({ context, page }) => {
  test.skip(
    !adminEmail ||
      !adminPassword ||
      !draftSlug ||
      !draftTitle ||
      !supabaseUrl ||
      !supabaseAnonKey,
    "Set the E2E admin credentials and draft listing fixture variables.",
  );

  await authenticateAdmin(context);
  let needsDraftRestore = false;

  try {
    let row = await findDraftRow(page);
    await expect(row.getByText("Draft", { exact: true })).toBeVisible();
    await row.getByRole("button", { name: "Actions" }).click();
    await page.getByRole("menuitem", { name: "Publish", exact: true }).click();
    needsDraftRestore = true;
    await expect(page.getByText("Property published.")).toBeVisible();

    const publicPage = await context.newPage();
    const publishedResponse = await publicPage.goto(`/properties/${draftSlug}`);
    expect(publishedResponse?.status()).toBe(200);
    await expect(
      publicPage.getByRole("heading", { name: draftTitle!, level: 1 }),
    ).toBeVisible();
    await publicPage.close();

    row = await findDraftRow(page);
    await expect(row.getByText("Published", { exact: true })).toBeVisible();
    await row.getByRole("button", { name: "Actions" }).click();
    await page.getByRole("menuitem", { name: "Unpublish", exact: true }).click();
    await expect(page.getByText("Property unpublished.")).toBeVisible();
    needsDraftRestore = false;

    const unpublishedResponse = await page.request.get(
      `/properties/${draftSlug}`,
    );
    expect(unpublishedResponse.status()).toBe(404);
  } finally {
    if (needsDraftRestore) {
      const row = await findDraftRow(page);
      await row.getByRole("button", { name: "Actions" }).click();
      const unpublish = page.getByRole("menuitem", {
        name: "Unpublish",
        exact: true,
      });
      if (await unpublish.isVisible()) await unpublish.click();
    }
  }
});
