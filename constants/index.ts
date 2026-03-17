import { PropertyStatus } from "@/app/generated/prisma/enums";

export const STATIC_STATS = {
  propertiesSold: "200+",
  yearsExperience: "10+",
  clientRating: "50+",
};

export const SITE_CONFIG = {
  // Basic info
  name: "Amelia Lawsin",
  tagline: "Licensed Real Estate Agent · Cebu, Philippines",
  prcLicenseNo: "8370",

  // Contact
  phone: "+63 956 500 5442",
  email: "amelialawsin08@gmail.com",
  location: "Cebu, Philippines",

  // Deep links
  messengerUrl: "https://m.me/amelialawsin",
  viberUrl: "viber://chat?number=+639XXXXXXXXX",
  smsUrl: "sms:+639XXXXXXXXX?body=Hi Amelia! I'm interested in a property.",

  // Social media
  facebookUrl: "https://facebook.com/amelialawsin",
  instagramUrl: "https://instagram.com/amelialawsin",
};

export const STATUS_LABELS: Record<PropertyStatus, string> = {
  FOR_SALE: "For Sale",
  FOR_RENT: "For Rent",
  PRE_SELLING: "Pre-selling",
  SOLD: "Sold",
  RENTED: "Rented",
};

export const STATUS_STYLES: Record<PropertyStatus, string> = {
  FOR_SALE: "bg-ink text-white",
  FOR_RENT: "bg-ink text-white",
  PRE_SELLING: "bg-white text-ink border border-wire",
  SOLD: "bg-gray-400 text-white",
  RENTED: "bg-gray-400 text-white",
};

export const HOW_IT_WORKS = [
  {
    title: "Browse listings",
    description:
      "Explore properties that match your budget, location, and lifestyle needs.",
  },
  {
    title: "Contact Amelia",
    description:
      "Reach out via Messenger, Viber, or SMS quick and easy, no forms needed.",
  },
  {
    title: "Schedule a viewing",
    description:
      "Visit the property at your convenience, even virtually for OFWs abroad.",
  },
  {
    title: "Own your property",
    description:
      "Amelia guides you through paperwork, financing, and turnover start to finish.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Juan Dela Cruz",
    location: "OFW · Dubai",
    initials: "JD",
    message:
      "Amelia helped us find the perfect condo in IT Park. Very professional and always responsive even with the time difference!",
  },
  {
    name: "Maria Santos",
    location: "Local buyer · Cebu City",
    initials: "MS",
    message:
      "She guided us through the whole Pag-IBIG process smoothly. We didn't expect it to be this easy. Highly recommended!",
  },
  {
    name: "Tom Lee",
    location: "Investor · Singapore",
    initials: "TL",
    message:
      "As a foreign investor, Amelia made the whole process easy and stress-free. She knows the Cebu market inside out.",
  },
];

export const PROPERTY_LINKS = [
  { href: "/properties?status=FOR_SALE", label: "For Sale" },
  { href: "/properties?status=FOR_RENT", label: "For Rent" },
  { href: "/properties?status=PRE_SELLING", label: "Pre-selling" },
  { href: "/properties?type=COMMERCIAL", label: "Commercial" },
];

export const COMPANY_LINKS = [
  { href: "/about", label: "About Amelia" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  // { href: "/privacy-policy", label: "Privacy Policy" }, //TODO: Add privacy policy page
];

export const BEDROOM_OPTIONS = [
  { value: "0", label: "Studio" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4+" },
];

export const CEBU_CITIES = [
  "Cebu City",
  "Mandaue City",
  "Lapu-Lapu City",
  "Consolacion",
  "Talisay City",
  "Liloan",
  "Minglanilla",
  "Naga City",
  "Danao City",
  "Carcar City",
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "featured", label: "Featured first" },
];

export const PAYMENT_TYPE_LABELS: Record<string, string> = {
  SPOT_CASH: "Spot Cash",
  IN_HOUSE_FINANCING: "In-house Financing",
  BANK_FINANCING: "Bank Financing",
  PAG_IBIG_FINANCING: "Pag-IBIG Financing",
  RENT_TO_OWN: "Rent-to-Own",
};

export const CREDENTIALS = [
  {
    abbr: "PRC",
    title: "Licensed Agent",
    detail: `Lic. No. ${SITE_CONFIG.prcLicenseNo}`,
    note: "Professional Regulation Commission",
  },
  {
    abbr: "REBAP",
    title: "Active Member",
    detail: "Cebu Chapter",
    note: "Real Estate Brokers Assoc. of the PH",
  },
  {
    abbr: "HDMF",
    title: "Pag-IBIG Accredited",
    detail: "Housing Fund",
    note: "Authorized to process Pag-IBIG housing loans",
  },
  {
    abbr: "2013",
    title: "Cebu-based",
    detail: "Since 2013",
    note: "Deep local knowledge of the Cebu property market",
  },
];
