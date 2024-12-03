import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Matches any domain using https
      },
      {
        protocol: "http",
        hostname: "**", // Matches any domain using http
      },
    ],
  },
};

export default nextConfig;
