import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/locations/list',
        permanent: true, 
      },
    ];
  },

  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
