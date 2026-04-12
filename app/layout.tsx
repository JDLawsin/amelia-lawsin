import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Amelia Lawsin",
  description: "A real estate agent website",
  applicationName: "Amelia",
  appleWebApp: {
    capable: true,
    title: "Amelia",
    statusBarStyle: "default",
  },
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
