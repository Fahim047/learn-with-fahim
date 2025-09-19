import type { NextConfig } from "next";
import "./lib/env"; // Ensure environment variables are loaded
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: "fif-lms.t3.storage.dev",
      },
    ],
  },
};

export default nextConfig;
