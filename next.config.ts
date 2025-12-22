import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["192.168.200.91:3000", "192.168.0.73"]
};

export default nextConfig;

