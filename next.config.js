/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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
