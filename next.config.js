/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webp: {
    preset: "default",
    quality: 100,
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: ["ui-avatars.com"],
  },
}

module.exports = nextConfig
