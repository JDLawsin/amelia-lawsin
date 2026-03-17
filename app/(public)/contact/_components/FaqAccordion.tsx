"use client";

import { useState } from "react";
import clsx from "clsx";

const FAQS = [
  {
    q: "Is your consultation really free?",
    a: "Yes — 100% free, no strings attached. My job is to help you find the right property. The seller or developer pays my commission, so there's no cost to you as a buyer.",
  },
  {
    q: "Can you help OFWs buy property remotely?",
    a: "Absolutely. I specialize in assisting OFWs from abroad. I can handle property viewings on your behalf, send video walkthroughs, and guide you through the entire buying process — including Pag-IBIG OFW loan applications — without you needing to fly home.",
  },
  {
    q: "Do you assist with Pag-IBIG loan applications?",
    a: "Yes. I am accredited by Pag-IBIG (HDMF) and can guide you step by step through the housing loan application — from eligibility check to document submission. This applies to both local and OFW buyers.",
  },
  {
    q: "What areas in Cebu do you cover?",
    a: "I cover the entire Metro Cebu area — Cebu City, Mandaue, Lapu-Lapu, Consolacion, Liloan, Talisay, Minglanilla, and beyond. I also have listings in Mactan for beach and vacation properties.",
  },
  {
    q: "How long does the buying process take?",
    a: "It depends on the type of property and financing. Cash purchases can close in 30-60 days. Financed purchases via bank or Pag-IBIG typically take 3-6 months. Pre-selling properties involve a 2-4 year wait until turnover.",
  },
  {
    q: "Do you handle both buying and renting?",
    a: "Yes. I have listings for sale, for rent, and pre-selling. Whether you're looking for a long-term home, a rental investment, or an office space — I can help.",
  },
];

// ─── Accordion item ───────────────────────────────────────────────────────────

const FaqItem = ({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="bg-white rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-4 text-left"
    >
      <span className="text-sm font-medium text-ink pr-4">{faq.q}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#86868b"
        strokeWidth="2"
        className={clsx(
          "shrink-0 transition-transform duration-200",
          isOpen && "rotate-180",
        )}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
    {isOpen && (
      <div className="px-5 pb-4 border-t border-wire">
        <p className="text-sm text-ash leading-relaxed pt-3">{faq.a}</p>
      </div>
    )}
  </div>
);

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <div className="flex flex-col gap-1.5">
      {FAQS.map((faq, i) => (
        <FaqItem
          key={faq.q}
          faq={faq}
          isOpen={openIndex === i}
          onToggle={() => toggle(i)}
        />
      ))}
    </div>
  );
};

export default FaqAccordion;
