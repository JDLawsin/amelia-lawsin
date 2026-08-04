"use client";

import { useState } from "react";
import clsx from "clsx";
import { CONTACT_FAQS } from "./contact-faq.data";

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
      type="button"
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
        aria-hidden="true"
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

  const toggle = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  return (
    <div className="flex flex-col gap-1.5">
      {CONTACT_FAQS.map((faq, index) => (
        <FaqItem
          key={faq.q}
          faq={faq}
          isOpen={openIndex === index}
          onToggle={() => toggle(index)}
        />
      ))}
    </div>
  );
};

export default FaqAccordion;
