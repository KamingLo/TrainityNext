import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/vi/**", // Ini mengizinkan semua gambar dari folder /vi/
      },
    ],
  },
};

export default nextConfig;
