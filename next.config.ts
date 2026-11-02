import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
