/** @type {import('next').NextConfig} */
const isGithubPages = process.env.DEPLOY_TARGET === 'gh-pages';
const basePath = isGithubPages ? '/Connect' : '';

const nextConfig = {
  output: isGithubPages ? 'export' : 'standalone',
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: isGithubPages ? true : false,
  images: {
    unoptimized: isGithubPages ? true : false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
