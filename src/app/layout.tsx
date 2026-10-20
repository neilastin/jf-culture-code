import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

/* Söhne Breit Fett is a licensed Klim font, supplied with the print files. */
const sohne = localFont({
  variable: "--font-sohne",
  src: "../fonts/SohneBreit-Fett.otf",
  weight: "700",
  display: "swap",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "The Journey Further Culture Code",
  description:
    "This matters more than your job description. Great strategy fails without great culture. This is ours.",
  openGraph: {
    title: "The Journey Further Culture Code",
    description: "Great strategy fails without great culture. This is ours.",
    images: ["/images/photos/who-we-are.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#3dbb9a",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-GB" className={`${manrope.variable} ${sohne.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
