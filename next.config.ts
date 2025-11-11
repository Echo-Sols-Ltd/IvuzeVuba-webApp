import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*  onfig options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
