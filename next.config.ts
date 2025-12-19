import type { NextConfig } from "next";

const allowedDevOrigins = process.env.NEXT_ALLOWED_DEV_ORIGINS
  ? process.env.NEXT_ALLOWED_DEV_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean)
  : undefined;

const nextConfig: NextConfig = {
  output: "standalone",
  // Renamed from `experimental.serverComponentsExternalPackages`
  serverExternalPackages: ["@prisma/client"],
  // Allow cross-origin requests from additional origins during development (optional)
  ...(allowedDevOrigins ? { allowedDevOrigins } : {}),
};

export default nextConfig;
