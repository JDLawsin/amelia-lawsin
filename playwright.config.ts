import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";
const resendBaseURL = "http://127.0.0.1:3101";
const e2eDatabaseURL = process.env.E2E_DATABASE_URL;

if (
  !process.env.PLAYWRIGHT_BASE_URL &&
  process.env.E2E_ALLOW_WRITES === "1" &&
  !e2eDatabaseURL
) {
  throw new Error(
    "E2E_DATABASE_URL must point to a dedicated development/test database when E2E_ALLOW_WRITES=1.",
  );
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : [
        {
          command: "node e2e/helpers/resend-server.mjs",
          url: `${resendBaseURL}/health`,
          reuseExistingServer: false,
          timeout: 30_000,
        },
        {
          command:
            "node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3100",
          url: baseURL,
          reuseExistingServer: false,
          timeout: 120_000,
          env: {
            E2E_DIST_DIR: ".next-e2e",
            RESEND_API_KEY: "re_e2e",
            RESEND_FROM_EMAIL: "e2e@example.com",
            E2E_RESEND_BASE_URL: resendBaseURL,
            ...(e2eDatabaseURL ? { DATABASE_URL: e2eDatabaseURL } : {}),
          },
        },
      ],
});
