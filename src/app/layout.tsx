import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ReserveListButtonLoader from "@/components/ReserveListButtonLoader";
import { ReserveProvider } from "@/components/ReserveContext";
import { AREA, BRAND_NAME } from "@/lib/config";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-playfair", display: "swap" });

export const metadata: Metadata = {
  title: `Home-run Book Exchange in ${AREA} | ${BRAND_NAME}`,
  description: `A small, home-run non-fiction book exchange in ${AREA}. Browse and reserve books, then arrange a public meetup over WhatsApp. One book in, one book out; Rs 100 per exchange.`,
  openGraph: {
    title: `Home-run Book Exchange in ${AREA} | ${BRAND_NAME}`,
    description: "Browse non-fiction books, reserve your selection, and arrange a public exchange by WhatsApp.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <ReserveProvider>
          <Navbar />
          {children}
          <Footer />
          <WhatsAppFloat />
          <ReserveListButtonLoader />
        </ReserveProvider>
      </body>
    </html>
  );
}
