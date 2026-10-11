---
name: review-e2e-test
description: Review Playwright E2E tests for user-focused coverage, resilience, isolation, and maintainability.
---

# Review E2E tests

Review the Playwright changes made in the current session and suggest or apply changes according to this guide.

## Testing philosophy

- Test user-visible behavior through public interfaces, not implementation details.
- Keep each test independent and safe to run alone or in parallel.
- Mock external services; test only behavior this application controls.
- Prioritize critical user journeys over exhaustive UI permutations.

## Best practices

- Prefer semantic locators: `getByRole`, `getByLabel`, `getByText`, then stable `getByTestId` hooks.
- Chain and filter locators to make them specific without relying on CSS structure or XPath.
- Use awaited, web-first Playwright assertions.
- Write names that describe the observable behavior.
- Keep each test focused on one behavior or coherent user flow.
- Follow an arrange-act-assert shape.
- Await every asynchronous interaction and assertion.
- Never use hard waits. Wait for a URL, response, or visible UI state.
- For failures, inspect `test-results/` screenshots, error context, video, and trace before proposing a fix.

## Review checklist

- [ ] Locators are semantic and resilient.
- [ ] Assertions are awaited and web-first.
- [ ] Tests are isolated and do not rely on execution order.
- [ ] Names clearly describe expected behavior.
- [ ] There are no unjustified hard-coded waits or timeouts.
- [ ] External dependencies are mocked or isolated appropriately.
- [ ] Mutating tests create unique fake data and clean up.
- [ ] The suite follows the repository's E2E rules.
