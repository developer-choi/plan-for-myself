/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/study-records',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
