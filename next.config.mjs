/** @type {import('next').NextConfig} */

const remotePatternsDev = [
  {hostname: "*.test"},
  {hostname: "*.local"},
  {hostname: "*.meo"},
]

let remotePatterns = [
  {
    hostname: "localhost",
  },
  {
    hostname: "127.0.0.1",
  },
  {
    protocol: "https",
    hostname: "*.saigontimestravel.com",
  },
  {
    protocol: "https",
    hostname: "lh3.googleusercontent.com",
  },
  {
    protocol: "https",
    hostname: "graph.facebook.com",
  },
  {
    protocol: "https",
    hostname: "static.xx.fbcdn.net",
  },
]

if (process.env.NODE_ENV === 'development') {
  remotePatterns = [...remotePatternsDev, ...remotePatterns]
}

const nextConfig = {
  images: {
    remotePatterns: remotePatterns,
  },
  reactStrictMode: true,
  assetPrefix: process.env.NODE_ENV === 'development' ? '' : process.env.RESOURCES_CDN_DOMAIN || '',
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
