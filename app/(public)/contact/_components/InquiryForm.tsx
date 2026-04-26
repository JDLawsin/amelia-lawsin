"use client";

import { useActionState, useRef } from "react";
import clsx from "clsx";

const PROPERTY_TYPES = [
  "Condo",
  "House & Lot",
  "Lot Only",
  "Townhouse",
  "Commercial",
  "Beach / Vacation Property",
  "Not sure yet",
];

// const SuccessState = () => (
//   <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
//     <div className="w-14 h-14 bg-cloud border border-wire rounded-full flex items-center justify-center">
//       <svg
//         width="22"
//         height="22"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="#1d1d1f"
//         strokeWidth="1.5"
//       >
//         <path
//           d="M20 6 9 17l-5-5"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//     </div>
//     <div>
//       <p className="text-base font-serif font-medium text-ink mb-1">
//         Inquiry sent!
//       </p>
//       <p className="text-sm text-ash leading-relaxed max-w-xs">
//         Amelia will get back to you shortly — usually within a few hours via
//         Messenger or email.
//       </p>
//     </div>
//   </div>
// );

const InquiryForm = () => {
  const [state, action, isPending] = useActionState(() => {}, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <input type="hidden" name="source" value="Contact page" />

      {/* Error message */}
      {/* {state && !state.success && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-xs text-red-600">{state.error}</p>
        </div>
      )} */}

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-fog" htmlFor="name">
            Full name <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Juan Dela Cruz"
            className={clsx(
              "h-10 px-3 rounded-xl text-sm text-ink",
              "bg-cloud border border-wire",
              "placeholder:text-fog",
              "focus:outline-none focus:border-ink transition-colors",
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-fog" htmlFor="email">
            Email address <span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="juan@email.com"
            className={clsx(
              "h-10 px-3 rounded-xl text-sm text-ink",
              "bg-cloud border border-wire",
              "placeholder:text-fog",
              "focus:outline-none focus:border-ink transition-colors",
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-fog" htmlFor="phone">
          Phone / WhatsApp <span className="text-fog">(optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+63 9XX XXX XXXX"
          className={clsx(
            "h-10 px-3 rounded-xl text-sm text-ink",
            "bg-cloud border border-wire",
            "placeholder:text-fog",
            "focus:outline-none focus:border-ink transition-colors",
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-fog" htmlFor="propertyType">
          I&apos;m interested in
        </label>
        <select
          id="propertyType"
          name="propertyType"
          defaultValue=""
          className={clsx(
            "h-10 px-3 rounded-xl text-sm text-ink",
            "bg-cloud border border-wire",
            "focus:outline-none focus:border-ink transition-colors",
            "appearance-none cursor-pointer",
          )}
        >
          <option value="" disabled>
            Select property type...
          </option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-fog" htmlFor="message">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Hi Amelia! I'm looking for..."
          className={clsx(
            "px-3 py-2.5 rounded-xl text-sm text-ink",
            "bg-cloud border border-wire",
            "placeholder:text-fog",
            "focus:outline-none focus:border-ink transition-colors",
            "resize-none",
          )}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={clsx(
          "w-full h-11 rounded-xl text-sm font-medium transition-colors mt-1",
          isPending
            ? "bg-ink/60 text-white cursor-not-allowed"
            : "bg-ink text-white hover:bg-ink/90",
        )}
      >
        {isPending ? "Sending..." : "Send inquiry"}
      </button>

      <p className="text-xs text-fog text-center">
        Your details are only shared with Amelia Lawsin
      </p>
    </form>
  );
};

export default InquiryForm;
