/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    trailingSlash: true,
    reactStrictMode: false,
    swcMinify: true,
};

module.exports = nextConfig;