# Lighthouse-minded UI

Every UI change should be capable of a 90+ Lighthouse result, preferably 100, without adding dependencies solely for a score. Measure only when the task calls for an audit or verification.

## Surface priority

| Surface | Performance / accessibility / best practices | SEO |
| --- | --- | --- |
| Public pages | Primary | Primary |
| Authenticated admin | Primary | Low; `noindex` is appropriate |

## Performance

- Keep pages and layouts as Server Components by default. Add `"use client"` only at the narrow boundary that needs state, effects, browser APIs, or event handlers.
- Use `next/image` with meaningful `alt` text and explicit dimensions or a stable aspect ratio.
- Use the existing `next/font` setup; do not add per-page webfonts.
- Avoid client waterfalls, layout shift, unused browser JavaScript, and eager loading of below-fold media.

## Accessibility

- Every control has an accessible name. Icon-only buttons need one explicitly.
- Dialogs and drawers have an accessible title.
- Preserve visible keyboard focus and sufficient contrast.
- Use semantic buttons, links, labels, landmarks, and ordered headings.
- Keep document language accurate and form errors associated with their fields.

## Best practices

- Never expose secrets, service credentials, or personal data in the client bundle or logs.
- External links opened in a new tab use an appropriate `rel` value.
- Feature-check optional browser APIs.
- Fix console errors and hydration warnings caused by the changed code.

## SEO

- Public routes use the Next.js Metadata API for useful, unique titles and descriptions.
- Property and other indexable detail pages expose crawlable server-rendered content, canonicals where needed, and accurate structured data when it adds real value.
- Admin routes should not chase keyword optimization; give them a useful title and prevent indexing.
