/** Full-page skeleton for the contact route loading state.
 *  Mirrors every contact section height so the footer stays stable when
 *  streamed content replaces this placeholder (CLS). */
const ContactLoadingSkeleton = () => (
  <main className="bg-white" aria-busy="true" aria-label="Loading contact page">
    <section className="border-b border-wire">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 text-center">
        <p className="text-[10px] font-medium text-ash uppercase tracking-[0.15em] mb-4">
          Get in touch
        </p>
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-ink tracking-tight leading-tight mb-4">
          Let&apos;s find your dream{" "}
          <br className="hidden md:block" />
          property together.
        </h1>
        <p className="text-sm text-ash leading-relaxed max-w-md mx-auto">
          Reach out via your preferred channel — Messenger, SMS, Viber, or
          email. Free consultation, no commitment required.
        </p>
      </div>
    </section>

    <section className="bg-cloud border-b border-wire" aria-hidden="true">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="h-3 w-44 rounded bg-wire/40 mx-auto mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-wire rounded-2xl overflow-hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white p-6 min-h-[11.5rem]">
              <div className="w-10 h-10 rounded-xl bg-cloud mb-4" />
              <div className="h-4 w-24 rounded bg-wire/50 mb-2" />
              <div className="h-3 w-36 rounded bg-wire/40 mb-4" />
              <div className="h-9 w-28 rounded-full bg-cloud" />
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="border-b border-wire min-h-[42rem]" aria-hidden="true">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-wire">
        <div className="px-6 lg:px-12 py-12">
          <div className="h-3 w-24 rounded bg-wire/40 mb-5" />
          <div className="h-7 w-56 rounded bg-wire/50 mb-2" />
          <div className="h-4 w-full max-w-sm rounded bg-wire/40 mb-8" />
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-16 rounded-xl bg-cloud" />
              <div className="h-16 rounded-xl bg-cloud" />
            </div>
            <div className="h-16 rounded-xl bg-cloud" />
            <div className="h-10 rounded-xl bg-cloud" />
            <div className="h-28 rounded-xl bg-cloud" />
            <div className="h-11 rounded-xl bg-wire/50 mt-1" />
          </div>
        </div>

        <div className="px-6 lg:px-12 py-12 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-cloud shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-20 rounded bg-wire/50" />
                  <div className="h-3 w-40 rounded bg-wire/40" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-44 rounded-2xl bg-cloud border border-wire" />
          <div className="flex gap-2">
            <div className="h-9 w-24 rounded-full bg-cloud" />
            <div className="h-9 w-28 rounded-full bg-cloud" />
          </div>
        </div>
      </div>
    </section>

    <section className="bg-cloud border-b border-wire min-h-[28rem]" aria-hidden="true">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="h-3 w-52 rounded bg-wire/40 mx-auto mb-2" />
        <div className="h-8 w-72 max-w-full rounded bg-wire/50 mx-auto mb-10" />
        <div className="max-w-2xl mx-auto flex flex-col gap-1.5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl px-5 ${index === 0 ? "py-4 min-h-[7.5rem]" : "py-4 min-h-[3.5rem]"}`}
            />
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default ContactLoadingSkeleton;
