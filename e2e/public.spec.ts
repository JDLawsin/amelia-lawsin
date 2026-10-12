import { randomUUID } from "node:crypto";
import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";
import {
  createPropertyFixture,
  findBookingFixture,
  findInquiryFixture,
  removeBookingFixture,
  removeInquiryFixture,
  removePropertyFixture,
  removeRateLimitFixture,
  usesLocalDatabaseFixtures,
} from "./helpers/database";
import { SITE_CONFIG } from "../constants";

const draftSlug = process.env.E2E_DRAFT_PROPERTY_SLUG;
const draftTitle = process.env.E2E_DRAFT_PROPERTY_TITLE;
const publishedSlug = process.env.E2E_PUBLISHED_PROPERTY_SLUG;
const publishedTitle = process.env.E2E_PUBLISHED_PROPERTY_TITLE;
const allowWrites = process.env.E2E_ALLOW_WRITES === "1";
const resendBaseURL = "http://127.0.0.1:3101";

type CapturedEmail = {
  to?: string | string[];
  reply_to?: string | string[];
};

const uniqueEmail = (kind: string) =>
  `e2e-${kind}-${randomUUID()}@example.com`;

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const readCapturedEmails = async (request: APIRequestContext) => {
  const response = await request.get(`${resendBaseURL}/messages`);
  expect(response.ok()).toBeTruthy();
  return (await response.json()) as CapturedEmail[];
};

const expectCapturedNotification = async (
  request: APIRequestContext,
  replyTo: string,
) => {
  expect(await readCapturedEmails(request)).toContainEqual(
    expect.objectContaining({
      to: SITE_CONFIG.email,
      reply_to: replyTo,
    }),
  );
};

const dismissCookieBanner = async (page: Page) => {
  const banner = page.getByRole("dialog", { name: "Cookie preferences" });
  await banner.getByRole("button", { name: "Decline" }).click();
};

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
  test.skip(
    !usesLocalDatabaseFixtures && (!publishedSlug || !publishedTitle),
    "Set the published listing fixture variables for a deployed target.",
  );

  const fixture = usesLocalDatabaseFixtures
    ? await createPropertyFixture(true)
    : null;
  const slug = fixture?.slug ?? publishedSlug!;
  const title = fixture?.title ?? publishedTitle!;

  try {
    await page.goto("/");

    await page.getByRole("link", { name: "Properties", exact: true }).click();
    await expect(page).toHaveURL(/\/properties$/);

    const listing = page
      .getByRole("main")
      .getByRole("link", { name: new RegExp(escapeRegex(title)) })
      .first();
    await expect(listing).toHaveAttribute("href", `/properties/${slug}`);

    await listing.click();
    await expect(page).toHaveURL((url) => url.pathname === `/properties/${slug}`);
    await expect(
      page.getByRole("heading", { name: title, level: 1 }),
    ).toBeVisible();
  } finally {
    if (fixture) await removePropertyFixture(fixture.id);
  }
});

test("a draft listing stays private and renders the property 404", async ({
  page,
}) => {
  test.skip(
    !usesLocalDatabaseFixtures && (!draftSlug || !draftTitle),
    "Set the draft listing fixture variables for a deployed target.",
  );

  const fixture = usesLocalDatabaseFixtures
    ? await createPropertyFixture(false)
    : null;
  const slug = fixture?.slug ?? draftSlug!;
  const title = fixture?.title ?? draftTitle!;

  try {
    await page.goto(`/properties/${slug}`);

    await expect(
      page.getByRole("heading", { name: "Property not found" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: title })).toHaveCount(0);
    // Metadata has no accessible role; CSS is the appropriate seam here.
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      /noindex/,
    );
  } finally {
    if (fixture) await removePropertyFixture(fixture.id);
  }
});

test("a logged-out visitor is redirected from admin to login", async ({ page }) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
});

test("the viewing dialog manages keyboard focus", async ({ page }) => {
  await page.goto("/contact");
  await dismissCookieBanner(page);

  const scheduleButton = page.getByRole("button", {
    name: "Schedule a viewing",
    exact: true,
  });
  await scheduleButton.click();

  const dialog = page.getByRole("dialog", { name: "Schedule a viewing" });
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(scheduleButton).toBeFocused();
});

test("a visitor can submit an inquiry", async ({ page, request }) => {
  test.skip(!allowWrites, "Set E2E_ALLOW_WRITES=1 for database-writing tests.");

  const email = uniqueEmail("inquiry");
  const clientIp = `e2e-${randomUUID()}`;

  if (usesLocalDatabaseFixtures) {
    await request.delete(`${resendBaseURL}/messages`);
    await page.setExtraHTTPHeaders({ "x-forwarded-for": clientIp });
  }

  try {
    await page.goto("/contact");
    await dismissCookieBanner(page);
    await page.getByLabel("Full name").fill("Playwright Inquiry");
    await page.getByLabel("Email address").fill(email);
    await page
      .getByLabel("Message")
      .fill("This is an automated end-to-end inquiry submission.");
    await page.getByRole("button", { name: "Send inquiry" }).click();

    await expect(page.getByText("Inquiry sent!", { exact: true })).toBeVisible({
      timeout: 15_000,
    });

    if (usesLocalDatabaseFixtures) {
      const inquiry = await findInquiryFixture(email);
      expect(inquiry).toMatchObject({
        name: "Playwright Inquiry",
        source: "Contact page",
      });
      await expectCapturedNotification(request, email);
    }
  } finally {
    if (usesLocalDatabaseFixtures) {
      await removeInquiryFixture(email);
      await removeRateLimitFixture(clientIp);
    }
  }
});

test("a visitor can submit a viewing request", async ({ page, request }) => {
  test.skip(!allowWrites, "Set E2E_ALLOW_WRITES=1 for database-writing tests.");

  const email = uniqueEmail("booking");
  const clientIp = `e2e-${randomUUID()}`;

  if (usesLocalDatabaseFixtures) {
    await request.delete(`${resendBaseURL}/messages`);
    await page.setExtraHTTPHeaders({ "x-forwarded-for": clientIp });
  }

  try {
    await page.goto("/contact");
    await dismissCookieBanner(page);
    const scheduleButton = page.getByRole("button", {
      name: "Schedule a viewing",
      exact: true,
    });
    await scheduleButton.click();

    const dialog = page.getByRole("dialog", { name: "Schedule a viewing" });
    await dialog.getByLabel("Preferred date").fill(availableBookingDate());

    const timeSelect = dialog.getByLabel("Preferred time");
    await expect(timeSelect).toBeEnabled();
    let availableTime: string | null = null;
    for (const option of await timeSelect.getByRole("option").all()) {
      const value = await option.getAttribute("value");
      if (value && (await option.isEnabled())) {
        availableTime = value;
        break;
      }
    }
    expect(availableTime).toBeTruthy();
    await timeSelect.selectOption(availableTime!);

    await dialog.getByLabel("Full name").fill("Playwright Booking");
    await dialog.getByLabel("Email", { exact: true }).fill(email);
    await dialog.getByRole("button", { name: "Request viewing" }).click();

    await expect(
      dialog.getByText("Viewing requested!", { exact: true }),
    ).toBeVisible({ timeout: 15_000 });

    if (usesLocalDatabaseFixtures) {
      const booking = await findBookingFixture(email);
      expect(booking).toMatchObject({
        name: "Playwright Booking",
        source: "Contact page",
        status: "PENDING",
      });
      await expectCapturedNotification(request, email);
    }
  } finally {
    if (usesLocalDatabaseFixtures) {
      await removeBookingFixture(email);
      await removeRateLimitFixture(clientIp);
    }
  }
});
