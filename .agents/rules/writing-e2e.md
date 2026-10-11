# Writing E2E tests

- MUST prefer `getByRole`, `getByLabel`, `getByText`, and `getByTestId` selectors so tests identify the UI as a user would.
- MUST NOT use `locator()` unless a semantic locator cannot express the target. Add a comment explaining why it is necessary.
- SHOULD use `test.describe.serial` only when a long flow genuinely requires ordered cases. Prefer isolated tests.
- SHOULD reuse an authentication storage state for tests that require a logged-in user.
- SHOULD reuse existing test-only helpers or endpoints when they improve reliability without bypassing authorization.
- COULD create test-only endpoints for controlled test-data setup and cleanup, but they must remain unavailable in production and must not bypass authorization.
- MUST use fake or dedicated test data. Never use real client, property-owner, or inquiry data.

# Debugging E2E tests

Before proposing a fix, inspect the Playwright artifacts under `test-results/`, especially `error-context.md`, failure screenshots, videos, and traces. Use the artifact state to distinguish an application regression from a brittle or incorrect test.
