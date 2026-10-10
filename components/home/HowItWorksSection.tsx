import { HOW_IT_WORKS } from "@/constants";

const HowItWorksSection = () => (
  <section className="border-b border-wire bg-cloud px-6 py-20 md:py-24">
    <div className="max-w-7xl mx-auto">
      <h2 className="mx-auto mb-14 max-w-2xl text-center text-3xl font-serif font-medium leading-tight tracking-[-0.025em] text-ink md:text-4xl">
        Simple steps to find your property
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {HOW_IT_WORKS.map((step, index) => (
          <div
            key={step.title}
            className="flex flex-col items-center text-center gap-3"
          >
            <div className="relative flex items-center justify-center w-full">
              {index !== HOW_IT_WORKS.length - 1 && (
                <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-y-1/2 w-full h-px bg-wire" />
              )}
              <div className="relative z-10 w-11 h-11 rounded-full bg-ink flex items-center justify-center shrink-0 shadow-apple-sm">
                <span className="text-sm font-medium text-white">
                  {index + 1}
                </span>
              </div>
            </div>

            <h3 className="text-base font-medium text-ink tracking-tight">
              {step.title}
            </h3>
            <p className="max-w-56 text-sm text-ash leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
