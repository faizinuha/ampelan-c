  // next.config.mjs
  import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    // ... existing config
    ...setupDevPlatform()
  };

  export default nextConfig;