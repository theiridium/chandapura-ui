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
        source: "/terms-and-conditions",
        destination: "/terms-and-conditions.html",
        permanent: true,
      },
      {
        source: "/dashboard/business-listing",
        destination: "/dashboard/business-listing/view-all",
        permanent: true,
      },
      {
        source: "/dashboard/advertise",
        destination: "/dashboard/advertise/view-all",
        permanent: true,
      },
      {
        source: "/dashboard/classified-listing",
        destination: "/dashboard/classified-listing/view-all",
        permanent: true,
      },
      {
        source: "/dashboard/job-listing",
        destination: "/dashboard/job-listing/view-all",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
