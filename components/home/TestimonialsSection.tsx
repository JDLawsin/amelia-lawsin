import { TESTIMONIALS } from "@/constants";

const TestimonialsSection = () => (
  <section className="py-14 px-4 bg-white border-b border-brand-green-muted">
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col items-center text-center mb-10">
        <h2 className="text-2xl font-serif font-semibold text-brand-green">
          {"What Clients Say"}
        </h2>
        <div className="w-8 h-0.5 bg-brand-gold mt-2 mb-3" />
        <p className="text-sm text-brand-green-light">
          {"Real experiences from real clients"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.name}
            className="flex flex-col gap-4 bg-brand-green-subtle border border-brand-green-muted rounded-xl p-5"
          >
            <span className="text-3xl leading-none font-serif text-brand-gold select-none">
              &ldquo;
            </span>

            <p className="text-sm text-brand-green-light leading-relaxed -mt-2 flex-1">
              {testimonial.message}
            </p>

            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="#C9A84C"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-brand-green-muted">
              <div className="w-9 h-9 rounded-full bg-brand-green flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-brand-gold">
                  {testimonial.initials}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-green">
                  {testimonial.name}
                </p>
                <p className="text-xs text-brand-green-light">
                  {testimonial.location}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
