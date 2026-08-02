"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { submitInquiry, type InquiryState } from "@/app/_actions/inquiry.actions";
import { InquirySchema, type InquiryInput } from "@/app/_schemas/inquiry.schema";

const PROPERTY_TYPES = [
  "Condo",
  "House & Lot",
  "Lot Only",
  "Townhouse",
  "Commercial",
  "Beach / Vacation Property",
  "Not sure yet",
];

const inputStyles = clsx(
  "h-10 px-3 rounded-xl text-sm text-ink",
  "bg-cloud border border-wire",
  "placeholder:text-ash",
  "focus:outline-none focus:border-ink transition-colors",
);

const labelStyles = "text-xs text-ash";

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
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<InquiryState>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors: clientErrors },
    reset,
  } = useForm<InquiryInput>({
    resolver: zodResolver(InquirySchema),
    defaultValues: {
      source: "Contact page",
      honeypot: "",
    },
  });

  const onSubmit = (data: InquiryInput) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

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
    reset();
  };

  const serverErrors =
    state && !state.success && "errors" in state ? state.errors : {};
  const serverMessage =
    state && !state.success && "message" in state ? state.message : undefined;

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={clsx(
          "flex flex-col gap-4 transition-all duration-300 ease-out",
          showSuccess && "opacity-0 scale-[0.98] pointer-events-none",
        )}
        aria-busy={isPending}
      >
        <input type="hidden" {...register("source")} />

        {/* Honeypot field: hidden from humans, traps bots */}
        <input
          type="text"
          {...register("honeypot")}
          tabIndex={-1}
          autoComplete="off"
          className="absolute opacity-0 -z-10"
          aria-hidden="true"
        />

        {/* Loading overlay */}
        <div
          className={clsx(
            "absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm transition-opacity duration-300",
            isPending ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <div className="w-8 h-8 border-2 border-wire border-t-ink rounded-full animate-spin" />
          <p className="text-xs font-medium text-ink">Sending inquiry...</p>
        </div>

        {/* Global error message */}
        {serverMessage && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-in slide-in-from-top-1 duration-200">
            <p className="text-xs text-red-600">{serverMessage}</p>
          </div>
        )}

        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelStyles} htmlFor="name">
              Full name <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              {...register("name")}
              type="text"
              placeholder="Juan Dela Cruz"
              className={clsx(inputStyles, {
                "border-red-300 focus:border-red-400": clientErrors.name || serverErrors.name,
              })}
            />
            {(clientErrors.name || serverErrors.name) && (
              <p className="text-xs text-red-500">
                {clientErrors.name?.message || serverErrors.name?.[0]}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelStyles} htmlFor="email">
              Email address <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              {...register("email")}
              type="email"
              placeholder="juan@email.com"
              className={clsx(inputStyles, {
                "border-red-300 focus:border-red-400": clientErrors.email || serverErrors.email,
              })}
            />
            {(clientErrors.email || serverErrors.email) && (
              <p className="text-xs text-red-500">
                {clientErrors.email?.message || serverErrors.email?.[0]}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelStyles} htmlFor="phone">
            Phone / WhatsApp <span className="text-ash">(optional)</span>
          </label>
          <input
            id="phone"
            {...register("phone")}
            type="tel"
            placeholder="+63 9XX XXX XXXX"
            className={clsx(inputStyles, {
              "border-red-300 focus:border-red-400": clientErrors.phone || serverErrors.phone,
            })}
          />
          {(clientErrors.phone || serverErrors.phone) && (
            <p className="text-xs text-red-500">
              {clientErrors.phone?.message || serverErrors.phone?.[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelStyles} htmlFor="propertyType">
            I&apos;m interested in
          </label>
          <select
            id="propertyType"
            {...register("propertyType")}
            defaultValue=""
            className={clsx(
              inputStyles,
              "appearance-none cursor-pointer",
              {
                "border-red-300 focus:border-red-400": clientErrors.propertyType || serverErrors.propertyType,
              },
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
          {(clientErrors.propertyType || serverErrors.propertyType) && (
            <p className="text-xs text-red-500">
              {clientErrors.propertyType?.message || serverErrors.propertyType?.[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelStyles} htmlFor="message">
            Message <span className="text-red-400">*</span>
          </label>
          <textarea
            id="message"
            {...register("message")}
            rows={4}
            placeholder="Hi Amelia! I'm looking for..."
            className={clsx(
              "px-3 py-2.5 rounded-xl text-sm text-ink",
              "bg-cloud border border-wire",
              "placeholder:text-ash",
              "focus:outline-none focus:border-ink transition-colors",
              "resize-none",
              {
                "border-red-300 focus:border-red-400": clientErrors.message || serverErrors.message,
              },
            )}
          />
          {(clientErrors.message || serverErrors.message) && (
            <p className="text-xs text-red-500">
              {clientErrors.message?.message || serverErrors.message?.[0]}
            </p>
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

        <p className="text-xs text-ash text-center">
          Your details are only shared with Amelia Lawsin
        </p>
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
