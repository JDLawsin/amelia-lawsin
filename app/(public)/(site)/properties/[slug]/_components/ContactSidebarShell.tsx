import { SITE_CONFIG } from "@/constants";
import { formatPrice } from "@/lib/utils";
import type { PropertyDetail } from "@/services/property.service";

export type ContactSidebarProps = {
  property: Pick<
    PropertyDetail,
    | "title"
    | "slug"
    | "type"
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
  shareUrl: string;
};

/** Static sidebar shell — renders before ContactSidebar client bundle loads. */
const ContactSidebarShell = ({ property, shareUrl }: ContactSidebarProps) => {
  const price = formatPrice(property as PropertyDetail);
  const location = [property.barangay, property.city]
    .filter(Boolean)
    .join(", ");

  const messageText = encodeURIComponent(
    `Hi Amelia! I'm interested in: ${property.title}. Can you send me more details?`,
  );
  const messengerUrl = `${SITE_CONFIG.messengerUrl}?text=${messageText}`;
  const smsUrl = `sms:${SITE_CONFIG.phone}?body=${messageText}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const financingTags = [
    property.isPagibigAccredited && "Pag-IBIG",
    property.isBankFinancingReady && "Bank Financing",
    property.isInHouseFinancing && "In-house",
    property.isRentToOwn && "Rent-to-Own",
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading contact options">
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
          type="button"
          disabled
          className="flex items-center justify-center w-full h-11 bg-transparent text-ash text-sm border border-wire rounded-xl opacity-70"
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

        <p className="text-xs text-ash text-center mt-3 leading-relaxed">
          Free consultation · No commitment required
        </p>
      </div>

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
            type="button"
            disabled
            className="flex-1 bg-white border border-wire rounded-xl py-2 text-xs text-ash text-center opacity-70"
          >
            Copy link
          </button>
          <a
            href={`viber://forward?text=${encodeURIComponent(`${property.title} ${shareUrl}`)}`}
            className="flex-1 bg-white border border-wire rounded-xl py-2 text-xs text-ash text-center hover:text-ink hover:border-ink transition-colors"
          >
            Viber
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactSidebarShell;
