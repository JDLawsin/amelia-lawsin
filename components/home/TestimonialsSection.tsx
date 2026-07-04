import { TESTIMONIALS } from "@/constants";
import SectionLabel from "@/components/ui/SectionLabel";

const TestimonialsSection = () => (
  <section className="py-14 px-6 bg-white border-b border-wire">
    <div className="max-w-7xl mx-auto">
      <SectionLabel>What clients say</SectionLabel>
      <h2 className="text-2xl md:text-3xl font-serif font-medium text-ink tracking-tight leading-snug text-center mb-10">
        Real experiences from real clients
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-wire rounded-2xl overflow-hidden">
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.name}
            className="bg-white px-6 py-7 flex flex-col"
          >
            <p className="text-3xl text-wire font-serif leading-none mb-4">
              &ldquo;
            </p>
            <p className="text-sm text-ash leading-relaxed flex-1 mb-5">
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
                <p className="text-[10px] text-fog">{testimonial.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
