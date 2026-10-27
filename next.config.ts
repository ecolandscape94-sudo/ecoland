import type { NextConfig } from 'next';
const config: NextConfig = {
  experimental: { agentUpgrade: 'security' },
  devIndicators: false,
  turbopack: { root: process.cwd() },
  images: { formats: ['image/avif', 'image/webp'], qualities: [75, 85, 90], remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }, { protocol: 'https', hostname: 'res.cloudinary.com' }] },
  async headers() { return [{ source: '/(.*)', headers: [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
  ] }]; }
};
export default config;
