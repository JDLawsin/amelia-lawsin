import { PropertyStatus } from "@/app/generated/prisma/enums";

export const STATIC_STATS = {
  propertiesSold: "200+",
  yearsExperience: "10+",
  clientRating: "50+",
};

export const SITE_CONFIG = {
  // Basic info
  name: "Amelia Lawsin",
  tagline: "Licensed Real Estate Broker · Cebu, Philippines",
  prcLicenseNo: "XXXXX",

  // Contact
  phone: "+639XXXXXXXXX",
  email: "amelia@amelialawsin.com",
  location: "Cebu City, Philippines",

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
  FOR_SALE: "bg-brand-green text-white",
  FOR_RENT: "bg-brand-gold text-white",
  PRE_SELLING: "bg-white text-brand-green border border-brand-green-muted",
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
  { href: "/privacy-policy", label: "Privacy Policy" },
];
