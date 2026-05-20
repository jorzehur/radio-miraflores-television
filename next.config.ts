import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-8691144e-eae6-4467-827b-8cc03c24dd5b.space-z.ai",
    ".space.chatglm.site",
    ".space-z.ai",
    "localhost",
  ],
};

export default nextConfig;
