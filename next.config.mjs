/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'http://localhost:3000',
    NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL ?? 'http://localhost:3000',
  },
  // eslint@9 removed options that next@14 still passes internally — skip during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
