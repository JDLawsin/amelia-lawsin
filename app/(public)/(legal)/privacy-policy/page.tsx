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
          Last updated: August 5, 2026
        </p>
      </div>
    </section>

    <section className="border-b border-wire">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 text-sm text-ash leading-relaxed">
        <h2 className="text-lg font-medium text-ink mb-3">1. Introduction</h2>
        <p className="mb-6">
          This Privacy Policy explains how {SITE_CONFIG.name} (“we”, “us”, or “our”)
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
          When you browse without submitting a form, we do not collect personal
          information that identifies you. Saved favorites and compare lists are
          stored only in your browser&apos;s local storage and are not sent to
          us unless you submit an inquiry.
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

        <h2 className="text-lg font-medium text-ink mb-3">6. Cookies, local storage, and analytics</h2>
        <p className="mb-3">
          This website does not use advertising cookies. The following may apply
          when you visit:
        </p>
        <ul className="list-disc pl-5 mb-3 space-y-1">
          <li>
            <strong className="text-ink font-medium">Local storage</strong> —
            favorites and compare lists are saved in your browser only and stay
            on your device until you clear them.
          </li>
          <li>
            <strong className="text-ink font-medium">Strictly necessary cookies</strong> —
            limited session or security cookies may be set so the site functions
            correctly (for example, on admin pages not visible to the public).
          </li>
          <li>
            <strong className="text-ink font-medium">Analytics (when enabled)</strong> —
            we may use Google Analytics to understand how visitors use the site
            (pages viewed, general traffic). This helps us improve the website.
            Analytics data is aggregated and does not include the contents of your
            inquiry messages. You can opt out via your browser&apos;s &ldquo;Do Not
            Track&rdquo; setting or a browser extension that blocks analytics scripts.
          </li>
        </ul>
        <p className="mb-6">
          We do not sell your browsing or inquiry data to advertisers.
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
