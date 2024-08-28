/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jeeh-1006.s3.ap-northeast-2.amazonaws.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "places.googleapis.com",
        port: ""
      }
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ["knex", "bullmq"],
    instrumentationHook: true
  }
};

export default nextConfig;
