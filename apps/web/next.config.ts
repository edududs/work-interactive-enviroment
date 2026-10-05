import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Automatic memoization: no hand-written useMemo/useCallback just for performance.
  reactCompiler: true,
  transpilePackages: ['@metaverso/contracts'],
};

export default nextConfig;
