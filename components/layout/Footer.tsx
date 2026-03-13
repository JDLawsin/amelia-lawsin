import Link from "next/link";
import Logo from "../ui/Logo";
import { COMPANY_LINKS, PROPERTY_LINKS, SITE_CONFIG } from "@/constants";

const FacebookIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const ViberIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.5 2C6.81 2 3 5.81 3 10.5c0 2.69 1.28 5.08 3.27 6.62L6 21l3.93-1.27C11.02 20.22 12.24 20.5 13.5 20.5c4.69 0 8.5-3.81 8.5-8.5S18.19 2 11.5 2zm0 15c-1.15 0-2.24-.28-3.19-.77l-2.31.74.75-2.25A6.46 6.46 0 0 1 5 10.5C5 6.91 7.91 4 11.5 4S18 6.91 18 10.5 15.09 17 11.5 17z" />
  </svg>
);

const Footer = () => (
  <footer className="bg-[#111F17] text-white">
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 flex flex-col gap-4">
          <Logo variant="dark" />
          <p className="text-xs text-brand-green-light leading-relaxed">
            {
              "Licensed Real Estate Broker in Cebu, Philippines. Helping buyers, OFWs, and investors find their dream property."
            }
          </p>
          <div className="flex gap-2 mt-1">
            <a
              href={SITE_CONFIG.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-md bg-brand-green flex items-center justify-center text-brand-green-muted hover:text-brand-gold hover:bg-brand-green/80 transition-colors"
            >
              <FacebookIcon />
            </a>
            <a
              href={SITE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-md bg-brand-green flex items-center justify-center text-brand-green-muted hover:text-brand-gold hover:bg-brand-green/80 transition-colors"
            >
              <InstagramIcon />
            </a>
            <a
              href={SITE_CONFIG.viberUrl}
              aria-label="Viber"
              className="w-8 h-8 rounded-md bg-brand-green flex items-center justify-center text-brand-green-muted hover:text-brand-gold hover:bg-brand-green/80 transition-colors"
            >
              <ViberIcon />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-white">{"Properties"}</h4>
          <nav className="flex flex-col gap-2">
            {PROPERTY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-brand-green-light hover:text-brand-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-white">{"Company"}</h4>
          <nav className="flex flex-col gap-2">
            {COMPANY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-brand-green-light hover:text-brand-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-white">{"Contact"}</h4>
          <div className="flex flex-col gap-2">
            <a
              href={`tel:${SITE_CONFIG.phone}`}
              className="text-xs text-brand-green-light hover:text-brand-gold transition-colors"
            >
              {SITE_CONFIG.phone}
            </a>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-xs text-brand-green-light hover:text-brand-gold transition-colors"
            >
              {SITE_CONFIG.email}
            </a>
            <span className="text-xs text-brand-green-light">
              {SITE_CONFIG.location}
            </span>
            <a
              href={SITE_CONFIG.messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-gold hover:text-brand-gold/80 transition-colors mt-1"
            >
              {"Message on Messenger →"}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-brand-green/40">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="text-xs text-brand-green-light">
          {"©"}
          {new Date().getFullYear()} {SITE_CONFIG.name}
          {" · Licensed Real Estate "}
          {"Broker · PRC Lic. No."}
          {SITE_CONFIG.prcLicenseNo}
        </span>
        <span className="text-xs text-brand-green/50">
          {"Built with ♥ in Cebu"}
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
