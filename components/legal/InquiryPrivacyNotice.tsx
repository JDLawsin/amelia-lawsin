import Link from "next/link";

/** Consent copy shown below inquiry form submit buttons. */
const InquiryPrivacyNotice = () => (
  <p className="text-xs text-ash text-center leading-relaxed">
    By submitting, you agree to our{" "}
    <Link
      href="/privacy-policy"
      className="text-ink underline underline-offset-2 hover:text-ash transition-colors"
    >
      Privacy Policy
    </Link>{" "}
    and{" "}
    <Link
      href="/terms-of-service"
      className="text-ink underline underline-offset-2 hover:text-ash transition-colors"
    >
      Terms of Service
    </Link>
    .
  </p>
);

export default InquiryPrivacyNotice;
