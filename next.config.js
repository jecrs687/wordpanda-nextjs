/** @type {import('next').NextConfig} */
const path = require('path')
const tsconfig = require(__dirname + '/tsconfig.json')

const alias = Object.entries(tsconfig.compilerOptions.paths)
  .reduce(
    (x, [name, [pathname]]) => (
      {
        ...x,
        [name.replace('/*', '')]: path.resolve('./' + pathname.replace('*', '')),
      }
    ), {})

const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...alias,
    }
    config.resolve.fallback = { fs: false, tls: false, net: false, child_process: false, canvas: false };

    return Object.assign({}, config, {
      module: Object.assign({}, config.module, {
        rules: config.module.rules.concat([
          {
            test: /\.svg$/i,
            use: [
              {
                loader: '@svgr/webpack',
                options: {
                  prettier: false,
                  svgo: true,
                  svgoConfig: {
                    plugins: [{ removeViewBox: false }, {
                      name: 'preset-default',
                      params: {
                        overrides: { removeViewBox: false },
                      },
                    }]
                  },
                  titleProp: true,
                  svgo: false,
                  memo: true,
                  typescript: true,
                },
              }
            ],

          }
        ]),
      }),
    });
  },
  images: {
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
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://www.primevideo.com/:path*',
      },
    ]
  },
}

module.exports = nextConfig
