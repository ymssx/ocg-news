/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yu-gi-oh.jp',
        port: '',
        pathname: '/images/**',
      },
    ],
  }
}

module.exports = nextConfig
