import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // This tells Next.js to export static files
  images: {
    unoptimized: true,
  },
  basePath: '/howdoyoufindme-frontend'  // Should match your repository name
};

export default nextConfig;
