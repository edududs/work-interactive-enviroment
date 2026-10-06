import type { NextConfig } from 'next';

// Where the web server finds the API, read when the app is built. The browser always calls /api.
const API_URL = process.env.API_URL ?? 'http://localhost:3001';

const nextConfig: NextConfig = {
  // Automatic memoization: no hand-written useMemo/useCallback just for performance.
  reactCompiler: true,
  transpilePackages: ['@metaverso/contracts'],
  rewrites: () => Promise.resolve([{ source: '/api/:path*', destination: `${API_URL}/:path*` }]),
};

export default nextConfig;
