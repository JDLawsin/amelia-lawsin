# End-to-end testing rules (Next.js + Playwright)

## Directory structure and naming

- Store E2E coverage in `e2e/<feature>/` as the suite grows. Do not add a second `tests/e2e` tree.
- Use `.spec.ts` for Playwright specs. Keep unit tests in `*.test.ts` or `*.test.tsx` and out of `e2e/`.
- Group by feature, not by role. Put shared locators and interactions in nearby `pages/` or `helpers/`; keep `test()` blocks in the spec.
- Run `npm run test:e2e`. Use fake or dedicated test data only.

## Page objects and fixtures

- Isolate reusable page locators and page-level actions in a page object or helper. Keep specs readable as user flows.
- Put feature page objects in `e2e/<feature>/pages/` and genuinely shared ones in `e2e/pages/`.
- Import `test` and `expect` from a shared fixture such as `e2e/fixtures/extended-test.ts` once one exists. Until then, import from `@playwright/test`.

## Resilient locators

- Prefer `getByRole` and `getByLabel` for visible UI. Use `getByTestId` for stable `e2e-*` hooks already present in the app.
- Do not select by styling classes or brittle DOM structure.
- Assert durable landmarks such as URL patterns, roles, labels, and stable test IDs instead of mutable marketing copy or live data values.

## Routing and network handling

- Use relative paths such as `page.goto("/properties")`; `baseURL` is configured in `playwright.config.ts`.
- Wait for readiness with `waitForURL` or a visible landmark. Prefer natural user flows over deep links where the navigation itself matters.
- Mock third-party traffic when isolation is required. Do not test external providers through their live production services.

## Authentication and mutations

- Do not log in through the UI inside every spec. Reuse a setup project or storage state when authenticated coverage expands.
- Cover multiple roles with `test.describe` and fixtures rather than role-suffixed duplicate specs.
- Tag tests that persist through the database, an upload, or an external integration with `@integration`. Keep read-only smoke tests untagged.
- Mutating specs must provision uniquely named test data and restore or remove it in a fixture or `finally` block.
