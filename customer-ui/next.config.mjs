/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // s3 bucket hostnames
      {
        protocol: "https",
        hostname: "your-bucket.s3.your-region.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
