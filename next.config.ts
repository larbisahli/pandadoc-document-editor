import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "pandadoc-document-editor.vercel.app"],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint errors during `next build` (e.g., on Vercel)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
