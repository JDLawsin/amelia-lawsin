"use client";

// app/(public)/properties/[slug]/_components/ContactSidebar.tsx

import { useState } from "react";
import { X } from "lucide-react";
import clsx from "clsx";
import { PropertyDetail } from "@/services/property.service";
import { SITE_CONFIG } from "@/constants";
import { formatPrice } from "@/lib/utils";

type Props = {
  property: Pick<
    PropertyDetail,
    | "title"
    | "price"
    | "priceLabel"
    | "status"
    | "city"
    | "barangay"
    | "floorLevel"
    | "isPagibigAccredited"
    | "isBankFinancingReady"
    | "isInHouseFinancing"
    | "isRentToOwn"
  >;
};

const ContactSidebar = ({ property }: Props) => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const price = formatPrice(property as PropertyDetail);
  const location = [property.barangay, property.city]
    .filter(Boolean)
    .join(", ");

  const messageText = encodeURIComponent(
    `Hi Amelia! I'm interested in: ${property.title}. Can you send me more details?`,
  );
  const messengerUrl = `${SITE_CONFIG.messengerUrl}?text=${messageText}`;
  const smsUrl = `sms:${SITE_CONFIG.phone}?body=${messageText}`;

  const financingTags = [
    property.isPagibigAccredited && "Pag-IBIG",
    property.isBankFinancingReady && "Bank Financing",
    property.isInHouseFinancing && "In-house",
    property.isRentToOwn && "Rent-to-Own",
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white border border-wire rounded-2xl p-5 shadow-apple">
        <p className="text-2xl font-serif font-medium text-ink tracking-tight mb-1">
          {price}
        </p>
        {location && <p className="text-xs text-ash mb-4">{location}</p>}

        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full h-11 bg-ink text-white text-sm font-medium rounded-xl hover:bg-ink/90 transition-colors mb-2"
        >
          Message on Messenger
        </a>

        <a
          href={smsUrl}
          className="flex items-center justify-center w-full h-11 bg-cloud text-ink text-sm font-medium rounded-xl border border-wire hover:bg-wire/30 transition-colors mb-2"
        >
          Send SMS / Viber
        </a>

        <button
          onClick={() => setInquiryOpen(true)}
          className="flex items-center justify-center w-full h-11 bg-transparent text-ash text-sm border border-wire rounded-xl hover:text-ink hover:border-ink transition-colors"
        >
          Send an inquiry
        </button>

        <div className="h-px bg-wire my-4" />

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-ink flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-white">AL</span>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">{SITE_CONFIG.name}</p>
            <p className="text-xs text-ash">Licensed Real Estate Agent · PRC</p>
          </div>
        </div>

        {financingTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {financingTags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-cloud text-ash border border-wire"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-[10px] text-fog text-center mt-3 leading-relaxed">
          Free consultation · No commitment required
        </p>
      </div>

      <ShareButtons slug={property.title} title={property.title} />

      {inquiryOpen && (
        <InquiryModal
          propertyTitle={property.title}
          onClose={() => setInquiryOpen(false)}
        />
      )}
    </div>
  );
};

const ShareButtons = ({ slug, title }: { slug: string; title: string }) => {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.href : "",
  )}`;

  return (
    <div className="bg-cloud rounded-2xl p-4">
      <p className="text-xs font-medium text-ink mb-3">Share this listing</p>
      <div className="flex gap-2">
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-white border border-wire rounded-xl py-2 text-xs text-ash text-center hover:text-ink hover:border-ink transition-colors"
        >
          Facebook
        </a>
        <button
          onClick={copyLink}
          className={clsx(
            "flex-1 bg-white border rounded-xl py-2 text-xs text-center transition-colors",
            copied
              ? "border-ink text-ink"
              : "border-wire text-ash hover:text-ink hover:border-ink",
          )}
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
        <a
          href={`viber://forward?text=${encodeURIComponent(title + " " + (typeof window !== "undefined" ? window.location.href : ""))}`}
          className="flex-1 bg-white border border-wire rounded-xl py-2 text-xs text-ash text-center hover:text-ink hover:border-ink transition-colors"
        >
          Viber
        </a>
      </div>
    </div>
  );
};

const InquiryModal = ({
  propertyTitle,
  onClose,
}: {
  propertyTitle: string;
  onClose: () => void;
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, propertyTitle }),
      });
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-apple-lg">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-serif font-medium text-ink">
            Send an inquiry
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cloud transition-colors"
          >
            <X className="w-4 h-4 text-ash" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-cloud rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1d1d1f"
                strokeWidth="2"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="text-sm font-medium text-ink mb-1">Inquiry sent!</p>
            <p className="text-xs text-ash">
              Amelia will get back to you shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-4 text-xs text-ash hover:text-ink transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-ash -mt-1 mb-1">
              Re: <span className="text-ink font-medium">{propertyTitle}</span>
            </p>

            {[
              { key: "name", placeholder: "Your full name", type: "text" },
              { key: "email", placeholder: "Email address", type: "email" },
              {
                key: "phone",
                placeholder: "Phone / WhatsApp (optional)",
                type: "tel",
              },
            ].map((field) => (
              <input
                key={field.key}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key as keyof typeof form]}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                className="w-full h-10 px-3 text-sm text-ink border border-wire rounded-xl bg-cloud placeholder:text-fog focus:outline-none focus:border-ink transition-colors"
              />
            ))}

            <textarea
              placeholder="Your message (optional)"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 text-sm text-ink border border-wire rounded-xl bg-cloud placeholder:text-fog focus:outline-none focus:border-ink transition-colors resize-none"
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !form.name || !form.email}
              className="w-full h-11 bg-ink text-white text-sm font-medium rounded-xl hover:bg-ink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Sending..." : "Send inquiry"}
            </button>

            <p className="text-[10px] text-fog text-center">
              Your details are only shared with Amelia Lawsin
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSidebar;
