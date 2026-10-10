import { TESTIMONIALS } from "@/constants";

const TestimonialsSection = () => (
  <section className="border-b border-wire bg-white px-6 py-20 md:py-24">
    <div className="max-w-7xl mx-auto">
      <h2 className="mx-auto mb-12 max-w-2xl text-center text-3xl font-serif font-medium leading-tight tracking-[-0.025em] text-ink md:text-4xl">
        Real experiences from real clients
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-wire rounded-2xl overflow-hidden">
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.name}
            className="bg-white px-6 py-7 flex flex-col"
          >
            <p className="mb-5 text-5xl font-serif leading-none text-wire" aria-hidden="true">
              &ldquo;
            </p>
            <p className="mb-6 flex-1 text-sm leading-relaxed text-ash">
              {testimonial.message}
            </p>
            <div className="flex items-center gap-3 pt-4">
              <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center shrink-0">
                <span className="text-[10px] font-semibold text-white">
                  {testimonial.initials}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-ink">
                  {testimonial.name}
                </p>
                <p className="text-[10px] text-ash">{testimonial.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
