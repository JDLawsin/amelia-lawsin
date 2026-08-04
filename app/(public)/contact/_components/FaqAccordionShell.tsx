import { CONTACT_FAQS } from "./contact-faq.data";

/** Native FAQ accordion — no JS required; matches layout until FaqAccordion hydrates. */
const FaqAccordionShell = () => (
  <div className="flex flex-col gap-1.5" aria-busy="true" aria-label="Loading FAQ">
    {CONTACT_FAQS.map((faq, index) => (
      <details
        key={faq.q}
        open={index === 0}
        className="bg-white rounded-xl overflow-hidden group"
      >
        <summary className="w-full flex items-center justify-between px-5 py-4 text-left list-none cursor-pointer [&::-webkit-details-marker]:hidden">
          <span className="text-sm font-medium text-ink pr-4">{faq.q}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#86868b"
            strokeWidth="2"
            className="shrink-0 transition-transform duration-200 group-open:rotate-180"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <div className="px-5 pb-4 border-t border-wire">
          <p className="text-sm text-ash leading-relaxed pt-3">{faq.a}</p>
        </div>
      </details>
    ))}
  </div>
);

export default FaqAccordionShell;
