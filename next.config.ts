import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * All imagery is served from `public/` — the ambience photography is
     * downloaded by scripts/fetch-ambience.mjs rather than hotlinked, so no
     * remotePatterns are needed and no request depends on a third-party fetch.
     *
     * Sources top out around 2000px, so offering 2048/3840 would only upscale.
     * Capping the ladder at 1920 also keeps the optimiser well inside its
     * timeout.
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
