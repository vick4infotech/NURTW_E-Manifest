/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  output: 'standalone',
  // Allow cross-origin requests from different IPs during development
  allowedDevOrigins: ['192.168.0.1', '192.168.1.*', '10.0.0.*'],
}

module.exports = nextConfig
