import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig = {
  images: {
    domains: ['ddragon.leagueoflegends.com'],
  },
}

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);