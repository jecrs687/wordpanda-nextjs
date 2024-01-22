/** @type {import('next').NextConfig} */
const path = require('path')
const tsconfig = require(__dirname + '/tsconfig.json')

const alias = Object.entries(tsconfig.compilerOptions.paths)
  .reduce(
    (x, [name, [pathname]]) => (
      {
        ...x,
        [name.replace('/*', '$')]: path.resolve(__dirname, '../../' + pathname.replace('/*', '')),
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
    };
    return Object.assign({}, config, {
      module: Object.assign({}, config.module, {
        rules: config.module.rules.concat([
          {
            test: /\.svg$/,
            loader: 'raw-loader',
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
  }
}

module.exports = nextConfig
