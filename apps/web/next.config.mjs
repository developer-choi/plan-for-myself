/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/studied-time',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
