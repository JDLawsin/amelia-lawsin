# Plan: Enable Navbar Logout and Add Privacy Policy Page

## Context

- `components/layout/Navbar.tsx` renders a user dropdown when a `user` exists. The **Profile** link and **Logout** item are both disabled.
- `app/(admin)/admin/_components/UserFooter.tsx` already implements logout via `getSupabaseBrowserClient().auth.signOut()` followed by `router.push("/")`.
- `constants/index.ts` has the `COMPANY_LINKS` privacy-policy entry commented out, so the footer only links to About, Blog, and Contact.
- No `/privacy-policy` page exists.
- The user wants the **Profile idea removed entirely** and a real privacy policy page added.

## Goals

1. Remove the disabled Profile item from the Navbar user dropdown.
2. Wire the Logout item to a working Supabase sign-out handler that redirects to `/`.
3. Add a static `/privacy-policy` page inside the public route group.
4. Enable the Privacy Policy link in `COMPANY_LINKS` so the footer shows it.

## Detailed Implementation Steps

### 1. `components/layout/Navbar.tsx` — Remove Profile, enable Logout

Add the same logout pattern already used in `UserFooter`:

```tsx
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
```

Inside the component:

```tsx
const router = useRouter();
const supabase = getSupabaseBrowserClient();

const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push("/");
};
```

Replace the current disabled Profile + Logout block:

```tsx
<DropdownMenuItem asChild disabled>
  <Link href="/profile">Profile</Link>
</DropdownMenuItem>

<DropdownMenuItem disabled>Logout</DropdownMenuItem>
```

with:

```tsx
<DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
```

- If TypeScript rejects `onClick` on `DropdownMenuItem`, use `onSelect={handleLogout}` instead.
- Optional: add `variant="destructive"` to the Logout item for red focus/hover styling.
- The dashboard link (shown only when `role === "ADMIN"`) stays as-is.

### 2. `constants/index.ts` — Enable the footer link

Uncomment the Privacy Policy entry in `COMPANY_LINKS`:

```ts
export const COMPANY_LINKS = [
  { href: "/about", label: "About Amelia" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
];
```

### 3. `app/(public)/privacy-policy/page.tsx` — Create the page

Create the file with the following content. It is a Server Component, uses the public layout (Navbar + Footer), and follows the existing visual style.

```tsx
import { SITE_CONFIG } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Amelia Lawsin",
  description:
    "Learn how Amelia Lawsin collects, uses, and protects your personal information when you submit an inquiry.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Privacy Policy — Amelia Lawsin",
    description: "How we handle your personal data and inquiries.",
    type: "website",
  },
};

const PrivacyPolicyPage = () => (
  <main className="bg-white">
    <section className="border-b border-wire">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-ink tracking-tight leading-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-ash leading-relaxed max-w-md mx-auto">
          Last updated: July 13, 2026
        </p>
      </div>
    </section>

    <section className="border-b border-wire">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 text-sm text-ash leading-relaxed">
        <h2 className="text-lg font-medium text-ink mb-3">1. Introduction</h2>
        <p className="mb-6">
          This Privacy Policy explains how {SITE_CONFIG.name} (“we”, “us”, or “our")
          collects, uses, and protects your personal information when you visit our
          website or submit an inquiry. By using this website, you agree to the
          practices described in this policy.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">2. Information we collect</h2>
        <p className="mb-3">
          When you fill out the contact or property inquiry form, we collect:
        </p>
        <ul className="list-disc pl-5 mb-6 space-y-1">
          <li>Your name</li>
          <li>Your email address</li>
          <li>Your phone or WhatsApp number (if you choose to provide it)</li>
          <li>The type of property you are interested in</li>
          <li>The property title, location, price, and status (when your inquiry is sent from a property listing page)</li>
          <li>The message you send us</li>
        </ul>
        <p className="mb-6">
          We do not use analytics, advertising, or other tracking tools on this site.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">3. How we use your information</h2>
        <p className="mb-3">We use your information to:</p>
        <ul className="list-disc pl-5 mb-6 space-y-1">
          <li>Respond to your questions and inquiries</li>
          <li>Recommend properties that match your needs</li>
          <li>Schedule viewings and follow up with you</li>
          <li>Send you a confirmation email that your inquiry was received</li>
          <li>Maintain internal records of our conversations</li>
        </ul>

        <h2 className="text-lg font-medium text-ink mb-3">4. Storage and security</h2>
        <p className="mb-6">
          Your inquiry data is stored in a secured database and access is limited to
          {SITE_CONFIG.name} and authorized administrators. We use reasonable
          safeguards to protect your information, but no internet-based system can be
          guaranteed to be completely secure.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">5. Sharing with third parties</h2>
        <p className="mb-6">
          We do not sell, rent, or share your personal information with third parties
          for marketing purposes. We use an email-sending service (Resend) only to
          deliver confirmation emails and inquiry notifications to us. Those messages
          are handled according to the provider’s own security and privacy practices.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">6. Cookies and tracking</h2>
        <p className="mb-6">
          This website does not use tracking or advertising cookies. Only cookies and
          local storage strictly necessary for the site to function may be used by
          your browser.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">7. Your rights</h2>
        <p className="mb-6">
          You can ask us to access, correct, or delete the personal information we hold
          about you. To make a request, contact us using the details below.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">8. Links to other websites</h2>
        <p className="mb-6">
          Our website may link to external sites such as social media pages. We are not
          responsible for the privacy practices or content of those third-party sites.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">9. Changes to this policy</h2>
        <p className="mb-6">
          We may update this Privacy Policy from time to time. Any changes will be
          posted on this page with an updated “Last updated” date.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">10. Contact us</h2>
        <p className="mb-2">
          If you have any questions about this Privacy Policy or how your information
          is handled, please contact us:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Email: <a href={`mailto:${SITE_CONFIG.email}`} className="text-ink underline hover:text-ash">{SITE_CONFIG.email}</a></li>
          <li>Phone / Viber: <a href={`tel:${SITE_CONFIG.phone}`} className="text-ink underline hover:text-ash">{SITE_CONFIG.phone}</a></li>
          <li>Location: {SITE_CONFIG.location}</li>
        </ul>
      </div>
    </section>
  </main>
);

export default PrivacyPolicyPage;
```

## Acceptance Criteria

- [ ] The Navbar dropdown no longer shows a disabled **Profile** link.
- [ ] The **Logout** item in the Navbar dropdown signs the user out and redirects to `/`.
- [ ] `COMPANY_LINKS` includes the Privacy Policy entry, and the footer displays it.
- [ ] `/privacy-policy` resolves and renders a styled, coherent privacy policy.
- [ ] The privacy policy accurately reflects the data collected by `InquiryForm` and the email/Prisma flow in `app/_actions/inquiry.actions.ts`.
- [ ] `npm run build` (or `next build`) completes without TypeScript or build errors.

## Validation Steps

1. Run the build/lint commands and fix any TypeScript errors.
2. Grep the codebase to confirm no leftover `/profile` references exist after removal:
   ```bash
   rg "/profile"
   ```
3. In a browser, log in as an admin, open the avatar dropdown, and click **Logout**. Confirm redirect to `/` and that the avatar/user menu disappears.
4. Visit `/privacy-policy` directly and via the footer link; verify rendering on mobile and desktop.
5. Confirm the page metadata (title, canonical, OG) is present in the HTML `<head>`.

## Rollback / Risks

- The privacy policy text is generic and not reviewed by a lawyer. It should be reviewed before being relied on for formal compliance.
- If the logout handler needs to support server-side session cleanup beyond `supabase.auth.signOut()`, additional work would be required; this plan follows the existing `UserFooter` pattern.
- No git operations are included in this plan.
