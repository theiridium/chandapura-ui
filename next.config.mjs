/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/dashboard/business-listing",
        destination: "/dashboard/business-listing/view-all",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
