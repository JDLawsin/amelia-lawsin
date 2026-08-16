"use client";

import {
  useEffect,
  useMemo,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { X } from "lucide-react";
import clsx from "clsx";
import {
  getBookedTimeSlots,
  submitBooking,
  type BookingState,
} from "@/app/_actions/booking.actions";
import {
  BOOKING_SLOT_HOURS,
  formatTimeSlotLabel,
  getDateRangeBounds,
  isSundayInManila,
} from "@/lib/booking-slots";
import InquiryPrivacyNotice from "@/components/legal/InquiryPrivacyNotice";
import {
  errorInputStyles,
  inputStyles,
  labelStyles,
  textareaStyles,
} from "@/app/(public)/(site)/contact/_components/inquiry-form.constants";

export type ScheduleViewingProperty = {
  title: string;
  slug: string;
  location?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  source: "Contact page" | "Property listing";
  property?: ScheduleViewingProperty;
};

const SuccessState = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => (
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
    <p className="text-sm font-medium text-ink mb-1">Viewing requested!</p>
    <p className="text-xs text-ash leading-relaxed mb-4">{message}</p>
    <button
      type="button"
      onClick={onClose}
      className="text-xs text-ash hover:text-ink transition-colors"
    >
      Close
    </button>
  </div>
);

const ScheduleViewingModal = ({ open, onClose, source, property }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [isLoadingSlots, startSlotsTransition] = useTransition();
  const [serverState, setServerState] = useState<BookingState>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [bookedHours, setBookedHours] = useState<number[]>([]);
  const { minDate, maxDate } = useMemo(() => getDateRangeBounds(), []);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setServerState(null);
        setSelectedDate("");
        setBookedHours([]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !selectedDate || isSundayInManila(selectedDate)) {
      const timer = setTimeout(() => setBookedHours([]), 0);
      return () => clearTimeout(timer);
    }

    startSlotsTransition(async () => {
      const slots = await getBookedTimeSlots(selectedDate);
      setBookedHours(slots);
    });
  }, [open, selectedDate]);

  if (!open) return null;

  const success = serverState?.success ?? false;
  const serverErrors =
    serverState && !serverState.success && "errors" in serverState
      ? serverState.errors
      : {};
  const serverMessage =
    serverState && !serverState.success && "message" in serverState
      ? serverState.message
      : undefined;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    startTransition(async () => {
      const result = await submitBooking(null, formData);
      setServerState(result);
    });
  };

  const sundaySelected = selectedDate ? isSundayInManila(selectedDate) : false;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-apple-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-serif font-medium text-ink">
            Schedule a viewing
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cloud transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-ash" />
          </button>
        </div>

        {success ? (
          <SuccessState
            message={
              serverState?.success
                ? serverState.message
                : "Amelia will confirm your slot shortly."
            }
            onClose={onClose}
          />
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <input type="hidden" name="source" value={source} readOnly />
            {property && (
              <>
                <input
                  type="hidden"
                  name="propertyTitle"
                  value={property.title}
                  readOnly
                />
                <input
                  type="hidden"
                  name="propertySlug"
                  value={property.slug}
                  readOnly
                />
                {property.location && (
                  <input
                    type="hidden"
                    name="propertyLocation"
                    value={property.location}
                    readOnly
                  />
                )}
              </>
            )}

            <input
              type="text"
              name="honeypot"
              tabIndex={-1}
              autoComplete="off"
              className="absolute opacity-0 -z-10"
              aria-hidden="true"
            />

            {property && (
              <p className="text-xs text-ash -mt-1 mb-1">
                Re:{" "}
                <span className="text-ink font-medium">{property.title}</span>
              </p>
            )}

            <p className="text-xs text-ash leading-relaxed">
              Choose a preferred date and time. Amelia will confirm availability
              before your visit.
            </p>

            {serverMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                <p className="text-xs text-red-600">{serverMessage}</p>
              </div>
            )}

            <div>
              <label className={labelStyles} htmlFor="booking-date">
                Preferred date
              </label>
              <input
                id="booking-date"
                type="date"
                name="date"
                required
                min={minDate}
                max={maxDate}
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className={clsx(inputStyles, "w-full mt-1", {
                  [errorInputStyles]: serverErrors.date,
                })}
              />
              {serverErrors.date && (
                <p className="text-xs text-red-500 mt-1">
                  {serverErrors.date[0]}
                </p>
              )}
              {sundaySelected && (
                <p className="text-xs text-red-500 mt-1">
                  Viewings are not available on Sundays.
                </p>
              )}
            </div>

            <div>
              <label className={labelStyles} htmlFor="booking-time">
                Preferred time
              </label>
              <select
                id="booking-time"
                name="timeSlot"
                required
                key={selectedDate}
                disabled={!selectedDate || sundaySelected || isLoadingSlots}
                className={clsx(inputStyles, "w-full mt-1", {
                  [errorInputStyles]: serverErrors.timeSlot,
                })}
                defaultValue=""
              >
                <option value="" disabled>
                  {isLoadingSlots ? "Loading times..." : "Select a time"}
                </option>
                {BOOKING_SLOT_HOURS.map((hour) => {
                  const booked = bookedHours.includes(hour);
                  return (
                    <option key={hour} value={hour} disabled={booked}>
                      {formatTimeSlotLabel(hour)}
                      {booked ? " (unavailable)" : ""}
                    </option>
                  );
                })}
              </select>
              {serverErrors.timeSlot && (
                <p className="text-xs text-red-500 mt-1">
                  {serverErrors.timeSlot[0]}
                </p>
              )}
            </div>

            <div>
              <label className={labelStyles} htmlFor="booking-name">
                Full name
              </label>
              <input
                id="booking-name"
                type="text"
                name="name"
                required
                minLength={2}
                maxLength={100}
                placeholder="Your full name"
                className={clsx(inputStyles, "w-full mt-1", {
                  [errorInputStyles]: serverErrors.name,
                })}
              />
              {serverErrors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {serverErrors.name[0]}
                </p>
              )}
            </div>

            <div>
              <label className={labelStyles} htmlFor="booking-email">
                Email
              </label>
              <input
                id="booking-email"
                type="email"
                name="email"
                required
                placeholder="Email address"
                className={clsx(inputStyles, "w-full mt-1", {
                  [errorInputStyles]: serverErrors.email,
                })}
              />
              {serverErrors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {serverErrors.email[0]}
                </p>
              )}
            </div>

            <div>
              <label className={labelStyles} htmlFor="booking-phone">
                Phone / WhatsApp{" "}
                <span className="text-ash">(optional)</span>
              </label>
              <input
                id="booking-phone"
                type="tel"
                name="phone"
                maxLength={50}
                placeholder="Phone / WhatsApp (optional)"
                className={clsx(inputStyles, "w-full mt-1", {
                  [errorInputStyles]: serverErrors.phone,
                })}
              />
              {serverErrors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {serverErrors.phone[0]}
                </p>
              )}
            </div>

            <div>
              <label className={labelStyles} htmlFor="booking-notes">
                Notes <span className="text-ash">(optional)</span>
              </label>
              <textarea
                id="booking-notes"
                name="notes"
                maxLength={500}
                rows={3}
                placeholder="Any questions or special requests?"
                className={clsx(textareaStyles, "w-full mt-1", {
                  [errorInputStyles]: serverErrors.notes,
                })}
              />
              {serverErrors.notes && (
                <p className="text-xs text-red-500 mt-1">
                  {serverErrors.notes[0]}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending || sundaySelected}
              className="w-full h-11 bg-ink text-white text-sm font-medium rounded-xl hover:bg-ink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? "Submitting..." : "Request viewing"}
            </button>

            <InquiryPrivacyNotice />
          </form>
        )}
      </div>
    </div>
  );
};

export default ScheduleViewingModal;
