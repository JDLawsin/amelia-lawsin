import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { getSiteUrl } from "@/lib/site";
import { SITE_CONFIG } from "@/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const siteUrl = getSiteUrl();

const siteDescription = `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}. Browse condos, house & lot, townhouses, and pre-selling properties across ${SITE_CONFIG.location}, with guidance on Pag-IBIG, bank, and in-house financing for buyers and OFWs.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_CONFIG.name} | Licensed Real Estate Agent in Cebu`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: siteDescription,
  applicationName: SITE_CONFIG.name,
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  keywords: [
    "Amelia Lawsin",
    "Cebu real estate agent",
    "Cebu properties for sale",
    "condos in Cebu",
    "house and lot Cebu",
    "pre-selling properties Cebu",
    "Pag-IBIG financing Philippines",
    "real estate broker Cebu",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} | Licensed Real Estate Agent in Cebu`,
    description: siteDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | Licensed Real Estate Agent in Cebu`,
    description: siteDescription,
  },
  appleWebApp: {
    capable: true,
    title: SITE_CONFIG.name,
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans bg-cloud`}
      >
        <Toaster position="top-right" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
