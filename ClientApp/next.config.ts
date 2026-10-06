import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://localhost:5292";

const nextConfig: NextConfig = {
  // Proxy /api/* to the .NET backend so the browser never hits CORS.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
};

export default nextConfig;
