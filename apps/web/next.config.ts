import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@hotelhub/design-tokens"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
