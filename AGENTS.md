<!-- BEGIN:nextjs-agent-rules -->
 
# Next.js: ALWAYS read docs before coding
 
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
 
<!-- END:nextjs-agent-rules -->

## Testing standards

- Unit and integration work follows `.agents/skills/tdd/SKILL.md`. Agree the public seam before writing a test, then work one red-green slice at a time.
- Playwright work follows `.agents/rules/writing-e2e.md` and `.agents/rules/e2e-test.md`.
- Review changed Playwright specs with `.agents/skills/review-e2e-test/SKILL.md` and the installed `.agents/skills/playwright-best-practices/SKILL.md`.
- Keep Playwright specs under `e2e/`, use fake or dedicated test data only, and inspect `test-results/` artifacts before changing code for a failed E2E test.

## Shared engineering rules

Codex uses the canonical rules in `.agents/rules/`. Cursor has compatible mirrors; keep both copies synchronized when a rule changes.

- For every implementation task, read and follow `.agents/rules/ponytail.md`.
- For user-facing UI, read and follow `.agents/rules/responsive-ui.md` and `.agents/rules/lighthouse-quality.md` before editing.
- For Playwright work, read and follow `.agents/rules/writing-e2e.md` and `.agents/rules/e2e-test.md` before editing.
- Before completing a feature, non-trivial bug fix, or refactor, read and follow `.agents/rules/finalize-review.md`, then `.agents/rules/clean-runtime.md`.
