import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.whitehouse.gov",
        port: "",
        pathname: "/wp-content/themes/whitehouse/assets/img/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
