"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import clsx from "clsx";
import { submitInquiry, type InquiryState } from "@/app/_actions/inquiry.actions";
import {
  errorInputStyles,
  inputStyles,
  labelStyles,
  PROPERTY_TYPES,
  textareaStyles,
} from "./inquiry-form.constants";
import InquiryPrivacyNotice from "@/components/legal/InquiryPrivacyNotice";

const SuccessState = ({
  message,
  onReset,
}: {
  message: string;
  onReset: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center gap-4 animate-in fade-in zoom-in-95 duration-300">
    <div className="w-14 h-14 bg-cloud border border-wire rounded-full flex items-center justify-center">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1d1d1f"
        strokeWidth="1.5"
      >
        <path
          d="M20 6 9 17l-5-5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <div>
      <p className="text-base font-serif font-medium text-ink mb-1">
        Inquiry sent!
      </p>
      <p className="text-sm text-ash leading-relaxed max-w-xs mb-4">{message}</p>
      <button
        type="button"
        onClick={onReset}
        className="text-xs font-medium text-ink underline underline-offset-2 hover:text-ash transition-colors"
      >
        Send another inquiry
      </button>
    </div>
  </div>
);

const InquiryForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<InquiryState>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    startTransition(async () => {
      const result = await submitInquiry(null, formData);
      setState(result);
      if (result?.success) {
        setShowSuccess(true);
      }
    });
  };

  const handleReset = () => {
    setShowSuccess(false);
    setState(null);
    formRef.current?.reset();
  };

  const serverErrors =
    state && !state.success && "errors" in state ? state.errors : {};
  const serverMessage =
    state && !state.success && "message" in state ? state.message : undefined;

  return (
    <div className="relative">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className={clsx(
          "flex flex-col gap-4 transition-all duration-300 ease-out",
          showSuccess && "opacity-0 scale-[0.98] pointer-events-none",
        )}
        aria-busy={isPending}
      >
        <input type="hidden" name="source" value="Contact page" readOnly />

        <input
          type="text"
          name="honeypot"
          tabIndex={-1}
          autoComplete="off"
          className="absolute opacity-0 -z-10"
          aria-hidden="true"
        />

        <div
          className={clsx(
            "absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm transition-opacity duration-300",
            isPending ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <div className="w-8 h-8 border-2 border-wire border-t-ink rounded-full animate-spin" />
          <p className="text-xs font-medium text-ink">Sending inquiry...</p>
        </div>

        {serverMessage && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-in slide-in-from-top-1 duration-200">
            <p className="text-xs text-red-600">{serverMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelStyles} htmlFor="contact-name">
              Full name <span className="text-red-400">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={100}
              placeholder="Juan Dela Cruz"
              className={clsx(inputStyles, {
                [errorInputStyles]: serverErrors.name,
              })}
            />
            {serverErrors.name && (
              <p className="text-xs text-red-500">{serverErrors.name[0]}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelStyles} htmlFor="contact-email">
              Email address <span className="text-red-400">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              placeholder="juan@email.com"
              className={clsx(inputStyles, {
                [errorInputStyles]: serverErrors.email,
              })}
            />
            {serverErrors.email && (
              <p className="text-xs text-red-500">{serverErrors.email[0]}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelStyles} htmlFor="contact-phone">
            Phone / WhatsApp <span className="text-ash">(optional)</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            maxLength={50}
            placeholder="+63 9XX XXX XXXX"
            className={clsx(inputStyles, {
              [errorInputStyles]: serverErrors.phone,
            })}
          />
          {serverErrors.phone && (
            <p className="text-xs text-red-500">{serverErrors.phone[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelStyles} htmlFor="contact-propertyType">
            I&apos;m interested in
          </label>
          <select
            id="contact-propertyType"
            name="propertyType"
            defaultValue=""
            className={clsx(inputStyles, "appearance-none cursor-pointer", {
              [errorInputStyles]: serverErrors.propertyType,
            })}
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
          {serverErrors.propertyType && (
            <p className="text-xs text-red-500">{serverErrors.propertyType[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelStyles} htmlFor="contact-message">
            Message <span className="text-red-400">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            required
            minLength={10}
            maxLength={2000}
            placeholder="Hi Amelia! I'm looking for..."
            className={clsx(textareaStyles, {
              [errorInputStyles]: serverErrors.message,
            })}
          />
          {serverErrors.message && (
            <p className="text-xs text-red-500">{serverErrors.message[0]}</p>
          )}
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

        <InquiryPrivacyNotice />
      </form>

      {showSuccess && state?.success && (
        <div className="absolute inset-0 flex items-center justify-center">
          <SuccessState message={state.message} onReset={handleReset} />
        </div>
      )}
    </div>
  );
};

export default InquiryForm;
