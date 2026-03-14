import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/juya-daily",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
