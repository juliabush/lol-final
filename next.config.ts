import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig = {
  images: {
    domains: ['ddragon.leagueoflegends.com'],
  },
  async redirects() {
    return [
      // Redirect old URLs to new ones
      {
        source: '/:locale/track',
        destination: '/:locale/tracker',
        permanent: true, // 301 redirect
      },
      {
        source: '/:locale/LookupID',
        destination: '/:locale/',
        permanent: true, // 301 redirect
      },
      {
        source: '/:locale/lists',
        destination: '/:locale/',
        permanent: true, // 301 redirect
      },
      {
        source: '/:locale/lists/:path*',
        destination: '/:locale/',
        permanent: true, // 301 redirect
      },
      {
        source: '/:locale/SearchAccountID/:path*',
        destination: '/:locale/',
        permanent: true, // 301 redirect
      },
      {
        source: '/:locale/generator/:param/Name Change/:name',
        destination: '/:locale/generator/:name',
        permanent: true, // 301 redirect
      },
      {
        source: '/:locale/generator/:param/Name%20Change/:name',
        destination: '/:locale/generator/:name',
        permanent: true, // 301 redirect
      },
      // Add more redirects as needed
    ]
  },
}

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);