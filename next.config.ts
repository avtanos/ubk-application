import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === 'production' ? "export" : undefined,
  basePath: process.env.NODE_ENV === 'production' ? "/ubk-application" : undefined,
  assetPrefix: process.env.NODE_ENV === 'production' ? "/ubk-application" : undefined,
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
