import { TESTIMONIALS } from "@/constants";

const TestimonialsSection = () => (
  <section className="py-14 px-4 bg-white border-b border-wire">
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col items-center text-center mb-10">
        <h2 className="text-2xl font-serif font-semibold text-ink">
          {"What Clients Say"}
        </h2>
        <div className="w-8 h-0.5 bg-ink mt-2 mb-3" />
        <p className="text-sm text-ash">
          {"Real experiences from real clients"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.name}
            className="flex flex-col gap-4 bg-cloud border border-wire rounded-xl p-5"
          >
            <span className="text-3xl leading-none font-serif text-ink select-none">
              &ldquo;
            </span>

            <p className="text-sm text-ash leading-relaxed -mt-2 flex-1">
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

            <div className="flex items-center gap-3 pt-3 border-t border-wire">
              <div className="w-9 h-9 rounded-full bg-ink flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-white">
                  {testimonial.initials}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">
                  {testimonial.name}
                </p>
                <p className="text-xs text-ash">{testimonial.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
