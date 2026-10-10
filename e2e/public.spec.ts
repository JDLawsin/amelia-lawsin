import { expect, test } from "@playwright/test";

const draftSlug = process.env.E2E_DRAFT_PROPERTY_SLUG;
const allowWrites = process.env.E2E_ALLOW_WRITES === "1";

const uniqueEmail = (kind: string) =>
  `e2e-${kind}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;

const availableBookingDate = () => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 3);

  while (
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      weekday: "short",
    }).format(date) === "Sun"
  ) {
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

test("a visitor can browse from home to a property detail", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Properties", exact: true }).click();
  await expect(page).toHaveURL(/\/properties$/);

  const firstListing = page.locator('main a[href^="/properties/"]').first();
  const href = await firstListing.getAttribute("href");
  expect(href).toMatch(/^\/properties\/[^/?#]+$/);

  await firstListing.click();
  await expect(page).toHaveURL((url) => url.pathname === href);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("a draft listing returns a property 404", async ({ page }) => {
  test.skip(!draftSlug, "Set E2E_DRAFT_PROPERTY_SLUG to a known draft listing.");

  const response = await page.goto(`/properties/${draftSlug}`);

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Property not found" }),
  ).toBeVisible();
});

test("a logged-out visitor is redirected from admin to login", async ({ page }) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
});

test("a visitor can submit an inquiry", async ({ page }) => {
  test.skip(!allowWrites, "Set E2E_ALLOW_WRITES=1 for database-writing tests.");

  await page.goto("/contact");
  await page.getByLabel("Full name").fill("Playwright Inquiry");
  await page.getByLabel("Email address").fill(uniqueEmail("inquiry"));
  await page
    .getByLabel("Message")
    .fill("This is an automated end-to-end inquiry submission.");
  await page.getByRole("button", { name: "Send inquiry" }).click();

  await expect(page.getByText("Inquiry sent!", { exact: true })).toBeVisible();
});

test("a visitor can submit a viewing request", async ({ page }) => {
  test.skip(!allowWrites, "Set E2E_ALLOW_WRITES=1 for database-writing tests.");

  await page.goto("/contact");
  await page
    .getByRole("button", { name: "Schedule a viewing", exact: true })
    .click();

  const dialog = page.locator(".fixed.inset-0");
  await dialog.getByLabel("Preferred date").fill(availableBookingDate());

  const timeSelect = dialog.getByLabel("Preferred time");
  await expect(timeSelect).toBeEnabled();
  const firstAvailableTime = timeSelect.locator("option:not([disabled])").first();
  await expect(firstAvailableTime).toBeAttached();
  await timeSelect.selectOption((await firstAvailableTime.getAttribute("value"))!);

  await dialog.getByLabel("Full name").fill("Playwright Booking");
  await dialog.getByLabel("Email", { exact: true }).fill(uniqueEmail("booking"));
  await dialog.getByRole("button", { name: "Request viewing" }).click();

  await expect(
    dialog.getByText("Viewing requested!", { exact: true }),
  ).toBeVisible();
});
