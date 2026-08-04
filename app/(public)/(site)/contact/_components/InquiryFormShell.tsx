import {
  inputStyles,
  labelStyles,
  PROPERTY_TYPES,
  textareaStyles,
} from "./inquiry-form.constants";
import InquiryPrivacyNotice from "@/components/legal/InquiryPrivacyNotice";

/** Static inquiry form shell — renders in HTML before the client bundle loads. */
const InquiryFormShell = () => (
  <div className="relative">
    <form
      className="flex flex-col gap-4"
      aria-busy="true"
      aria-label="Loading inquiry form"
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
            className={inputStyles}
          />
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
            className={inputStyles}
          />
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
          className={inputStyles}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelStyles} htmlFor="contact-propertyType">
          I&apos;m interested in
        </label>
        <select
          id="contact-propertyType"
          name="propertyType"
          defaultValue=""
          className={`${inputStyles} appearance-none cursor-pointer`}
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
          className={textareaStyles}
        />
      </div>

      <button
        type="button"
        disabled
        className="w-full h-11 rounded-xl text-sm font-medium transition-colors mt-1 bg-ink/60 text-white cursor-not-allowed"
      >
        Send inquiry
      </button>

      <InquiryPrivacyNotice />
    </form>
  </div>
);

export default InquiryFormShell;
