import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [480, 640, 768, 1024, 1280, 1536],
  },
  
  reactStrictMode: true,
  allowedDevOrigins: [
    "preview-chat-8691144e-eae6-4467-827b-8cc03c24dd5b.space-z.ai",
    ".space.chatglm.site",
    ".space-z.ai",
    "localhost",
  ],
};

export default nextConfig;
