/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Disable server-side features for static export
  experimental: {
    // Ensure no dynamic server features are used
  },
};

module.exports = nextConfig;
