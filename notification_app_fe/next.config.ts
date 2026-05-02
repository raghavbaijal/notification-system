import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/notifications',
        destination: 'http://20.207.122.201/evaluation-service/notifications',
      },
    ];
  },
};

export default nextConfig;
