import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ReserveProvider } from "@/components/ReserveContext";
import { ADDRESS, AREA, BRAND_NAME, CITY, INSTAGRAM_URL, PHONE_NUMBER, SITE_URL } from "@/lib/config";

const FloatingActionsLoader = dynamic(() => import("@/components/FloatingActionsLoader"), { loading: () => null });

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-playfair", display: "swap" });

export const metadata: Metadata = {
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: { default: `Non-fiction Book Exchange in ${AREA} | ${BRAND_NAME}`, template: `%s | ${BRAND_NAME}` },
  description: `A home-run non-fiction book exchange in ${AREA}. Exchange one book for one book, pay Rs 100 in person, and meet at ${ADDRESS}. No delivery or courier service.`,
  openGraph: {
    title: `Non-fiction Book Exchange in ${AREA} | ${BRAND_NAME}`,
    description: `Browse non-fiction books, reserve your selection, and exchange in person at ${ADDRESS}. One book for one book; Rs 100 per exchange.`,
    type: "website",
    images: [{ url: "/og-book-exchange.png", width: 1200, height: 630, alt: `${BRAND_NAME} non-fiction book exchange in Krishna Nagar, Delhi` }],
  },
  twitter: { card: "summary_large_image", images: ["/og-book-exchange.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: BRAND_NAME,
  description: `Home-run non-fiction book exchange in ${AREA}. In-person exchanges only; no delivery or courier service.`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "H6, Krishna Nagar",
    addressLocality: CITY,
    postalCode: "110051",
    addressRegion: CITY,
    addressCountry: "IN",
  },
  telephone: PHONE_NUMBER,
  areaServed: { "@type": "City", name: CITY },
  sameAs: [INSTAGRAM_URL],
  ...(SITE_URL ? { url: SITE_URL } : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="min-h-screen overflow-x-hidden antialiased" suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c") }} />
        <ReserveProvider>
          <Navbar />
          {children}
          <Footer />
          <FloatingActionsLoader />
        </ReserveProvider>
      </body>
    </html>
  );
}
