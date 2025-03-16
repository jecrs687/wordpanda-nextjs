import { NextConfig } from "next"

/** @type {import('next').NextConfig} */
const path = require('path')
const tsconfig = require(__dirname + '/tsconfig.json')

const alias = Object.entries(tsconfig.compilerOptions.paths as Record<string, string[]>)
  .reduce(
    (x, [name, [pathname]]) => (
      {
        ...x,
        [name.replace('/*', '')]: path.resolve('./' + pathname.replace('*', '')),
      }
    ), {})

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {

    turbo: {
      rules: {
        '*.html': {
          loaders: ['raw-loader'],
          as: 'string',
        },
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
      resolveAlias: alias
      ,
    }
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...alias,
    }
    config.resolve.fallback = { fs: false, tls: false, net: false, child_process: false, canvas: false };

    return Object.assign({}, config, {
      module: Object.assign({}, config.module),

    });
  },
  images: {
    minimumCacheTTL: 360,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/fonts/Stand-Alone.otf",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      }, {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "*",
          },
        ]
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
}

module.exports = nextConfig


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {

    silent: true,
    org: "jecrs687",
    project: "wordpanda-next",
  },
  {
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
