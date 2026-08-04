/** Full-page skeleton for the privacy policy route loading state.
 *  Mirrors section heights so the footer stays stable during navigation (CLS). */
const PrivacyPolicyLoadingSkeleton = () => (
  <main className="bg-white" aria-busy="true" aria-label="Loading privacy policy">
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

    <section className="border-b border-wire min-h-208" aria-hidden="true">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 space-y-8">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="h-5 w-40 rounded bg-wire/50" />
            <div className="h-3 w-full rounded bg-wire/40" />
            <div className="h-3 w-full rounded bg-wire/40" />
            <div className="h-3 w-[80%] rounded bg-wire/40" />
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default PrivacyPolicyLoadingSkeleton;
