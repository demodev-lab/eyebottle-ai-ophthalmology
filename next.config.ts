import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // WSL 환경에서 Hot Reloading 개선
    turbo: {
      rules: {},
    },
  },
  // 개발 모드에서 Hot Reloading 최적화
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // WSL 환경에서 파일 감시 최적화
      config.watchOptions = {
        poll: 1000, // 1초마다 파일 변경 확인
        aggregateTimeout: 300, // 300ms 후 리빌드
        ignored: /node_modules/, // node_modules 감시 제외
      };
      
      // 캐시 무효화 설정
      config.cache = false;
      
      // 더 빠른 리빌드를 위한 설정
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
        };
      }
    }
    return config;
  },
  
  // 개발서버 설정
  ...(process.env.NODE_ENV === 'development' && {
    headers: async () => [
      {
        source: '/(.*)',
        headers: [
          // 캐시 방지 헤더
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ],
  }),
};

export default nextConfig;
