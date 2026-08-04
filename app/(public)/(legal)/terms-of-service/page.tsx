import { SITE_CONFIG } from "@/constants";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Amelia Lawsin",
  description:
    "Terms and conditions for using the Amelia Lawsin real estate website, including listing disclaimers and inquiry policies.",
  alternates: { canonical: "/terms-of-service" },
  openGraph: {
    title: "Terms of Service — Amelia Lawsin",
    description: "Terms for using this website and submitting property inquiries.",
    type: "website",
  },
};

const TermsOfServicePage = () => (
  <main className="bg-white">
    <section className="border-b border-wire">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-ink tracking-tight leading-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-sm text-ash leading-relaxed max-w-md mx-auto">
          Last updated: August 5, 2026
        </p>
      </div>
    </section>

    <section className="border-b border-wire">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 text-sm text-ash leading-relaxed">
        <h2 className="text-lg font-medium text-ink mb-3">1. Agreement</h2>
        <p className="mb-6">
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of this
          website operated by {SITE_CONFIG.name}, a licensed real estate agent in
          Cebu, Philippines (PRC Lic. No. {SITE_CONFIG.prcLicenseNo}). By
          accessing or using this website, you agree to these Terms. If you do
          not agree, please do not use the site.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">
          2. Informational purpose only
        </h2>
        <p className="mb-6">
          Property listings, prices, photos, floor plans, payment schemes, and
          other content on this website are provided for general information
          only. They do not constitute legal, financial, tax, or investment
          advice. You should verify all details — including availability, price,
          title status, and developer terms — directly with {SITE_CONFIG.name}{" "}
          before making any decision.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">
          3. Listing accuracy and availability
        </h2>
        <p className="mb-3">
          While we strive to keep listings accurate and up to date:
        </p>
        <ul className="list-disc pl-5 mb-6 space-y-1">
          <li>Properties may be sold, rented, or reserved without immediate notice</li>
          <li>Prices, payment terms, and promotions may change at any time</li>
          <li>Photos and renders may differ from the actual unit or finished product</li>
          <li>Square footage, floor levels, and amenities should be confirmed on viewing</li>
        </ul>
        <p className="mb-6">
          {SITE_CONFIG.name} is not liable for decisions made based on outdated or
          incomplete listing information. Always confirm current status before
          proceeding.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">
          4. No agency relationship
        </h2>
        <p className="mb-6">
          Browsing this website, saving favorites locally in your browser, or
          submitting an inquiry does not create a broker–client or agency
          relationship. A formal engagement begins only when you and{" "}
          {SITE_CONFIG.name} explicitly agree to work together on a specific
          transaction.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">5. Inquiries</h2>
        <p className="mb-6">
          When you submit a contact or property inquiry, you confirm that the
          information you provide is accurate and that you consent to being
          contacted in response. See our{" "}
          <Link
            href="/privacy-policy"
            className="text-ink underline underline-offset-2 hover:text-ash transition-colors"
          >
            Privacy Policy
          </Link>{" "}
          for how your personal data is handled.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">
          6. Intellectual property
        </h2>
        <p className="mb-6">
          Website design, branding, original copy, and listing materials on this
          site are owned by {SITE_CONFIG.name} or used with permission. You may
          not copy, scrape, republish, or commercially reuse content without
          prior written consent, except for personal, non-commercial sharing of
          individual listing links.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">
          7. Third-party links and services
        </h2>
        <p className="mb-6">
          This website may link to third-party services such as Messenger,
          Facebook, Instagram, Google Maps, and developer or seller websites. We
          do not control and are not responsible for their content, availability,
          or privacy practices. Your use of those services is subject to their
          own terms.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">
          8. Limitation of liability
        </h2>
        <p className="mb-6">
          To the fullest extent permitted by applicable law, {SITE_CONFIG.name}{" "}
          and this website are provided &ldquo;as is&rdquo; without warranties of
          any kind. We are not liable for any indirect, incidental, or
          consequential loss arising from your use of this website or reliance on
          listing information, except where liability cannot be excluded by law.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">9. Changes</h2>
        <p className="mb-6">
          We may update these Terms from time to time. Continued use of the
          website after changes are posted constitutes acceptance of the revised
          Terms. The &ldquo;Last updated&rdquo; date at the top of this page
          indicates when they were last revised.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">10. Governing law</h2>
        <p className="mb-6">
          These Terms are governed by the laws of the Republic of the Philippines.
          Any disputes shall be subject to the exclusive jurisdiction of the
          courts of Cebu, Philippines, unless otherwise required by applicable
          law.
        </p>

        <h2 className="text-lg font-medium text-ink mb-3">11. Contact</h2>
        <p className="mb-2">
          Questions about these Terms? Contact us:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Email:{" "}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-ink underline hover:text-ash"
            >
              {SITE_CONFIG.email}
            </a>
          </li>
          <li>
            Phone / Viber:{" "}
            <a
              href={`tel:${SITE_CONFIG.phone}`}
              className="text-ink underline hover:text-ash"
            >
              {SITE_CONFIG.phone}
            </a>
          </li>
          <li>Location: {SITE_CONFIG.location}</li>
        </ul>
      </div>
    </section>
  </main>
);

export default TermsOfServicePage;
