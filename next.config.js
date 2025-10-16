/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  // optional, only if you later hit type errors during the build:
  // typescript: { ignoreBuildErrors: true },
};
module.exports = nextConfig;
