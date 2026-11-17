import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [360, 640, 828, 1080, 1200],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2_592_000,
  },
  async redirects() {
    return [{ source: "/visit", destination: "/exchange-point", permanent: true }];
  },
};

export default nextConfig;
