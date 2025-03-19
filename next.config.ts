const path = require('path');
const tsconfig = require('./tsconfig.json'); // Assumes tsconfig.json is in the project root

// Generate aliases from tsconfig.json paths for consistent module resolution
const alias = {};
for (const [key, values] of Object.entries(tsconfig.compilerOptions.paths)) {
  const aliasKey = key.replace('/*', ''); // Remove wildcard from key (e.g., "@components/*" -> "@components")
  const aliasPath = values[0].replace('*', ''); // Remove wildcard from path (e.g., "src/components/*" -> "src/components/")
  alias[aliasKey] = path.resolve(__dirname, aliasPath); // Resolve to absolute path
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable full URL logging for fetch requests (useful for debugging)
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Experimental features (e.g., Turbo for SWC-based builds)
  experimental: {
    turbo: {
      // Define custom rules for file handling (note: relies on Webpack fallback for these loaders)
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
      resolveAlias: alias, // Apply aliases to Turbo
    },
  },

  // Custom Webpack configuration
  webpack: (config) => {
    // Extend resolve aliases with those from tsconfig.json
    config.resolve.alias = { ...config.resolve.alias, ...alias };

    // Disable Node.js-specific modules in the browser
    config.resolve.fallback = {
      fs: false,
      tls: false,
      net: false,
      child_process: false,
      canvas: false,
    };

    // Add rule for .html files to be treated as raw strings
    config.module.rules.push({
      test: /\.html$/,
      use: 'raw-loader',
    });

    // Find the default file loader rule (used for static assets like images)
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );
    if (fileLoaderRule) {
      // Exclude .svg files from the default file loader
      fileLoaderRule.exclude = /\.svg$/i;

      // Handle .svg files with ?url query using the file loader
      config.module.rules.push({
        test: /\.svg$/i,
        resourceQuery: /url/, // Matches *.svg?url
        use: fileLoaderRule.use, // Reuse the file loader’s configuration
      });
    }

    // Handle other .svg imports as React components with SVGR
    config.module.rules.push({
      test: /\.svg$/i,
      resourceQuery: { not: /url/ }, // Exclude *.svg?url
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // Image optimization settings
  images: {
    minimumCacheTTL: 360, // Cache images for at least 6 minutes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*', // Allows all HTTPS sources (consider specifying trusted domains for security)
      },
    ],
  },

  // SASS configuration
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')], // Include custom styles directory
  },

  // Disable React Strict Mode (enable for development to catch issues)
  reactStrictMode: false,

  // Custom headers for caching and CORS
  async headers() {
    return [
      // Cache font file for one year
      {
        source: '/fonts/Stand-Alone.otf',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // CORS settings for API routes
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Allow all origins (no credentials)
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};

// Export the base configuration
module.exports = nextConfig;

// Wrap with Sentry configuration for error monitoring
const { withSentryConfig } = require('@sentry/nextjs');
module.exports = withSentryConfig(
  module.exports,
  {
    silent: true, // Suppress Sentry CLI output
    org: 'jecrs687',
    project: 'wordpanda-next',
  },
  {
    widenClientFileUpload: true, // Upload more client files for better error tracking
    transpileClientSDK: true, // Support IE11 (increases bundle size; set to false if not needed)
    tunnelRoute: '/monitoring', // Route requests through Next.js to avoid ad-blockers (increases server load)
    hideSourceMaps: true, // Hide source maps from client bundles
    disableLogger: true, // Tree-shake Sentry logger to reduce bundle size
    automaticVercelMonitors: true, // Enable Vercel Cron Monitors instrumentation
  }
);