import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { getLocale, getDir } from "@/lib/i18n/server";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Luxury Pyramids View Hotel",
    template: "%s | Luxury Pyramids View Hotel",
  },
  description:
    "A luxury hotel on the Giza Plateau with direct views of the Pyramids of Giza. Rooms, suites, dining and experiences.",
};

export const viewport: Viewport = {
  themeColor: "#1a1815",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const dir = getDir(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}