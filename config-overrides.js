const {override, overrideDevServer} = require('customize-cra')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = override((config, env) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': resolve('src'),
    '@components': resolve('components'),
    '@pages': resolve('src/pages')
  };
  // config.resolve.extensions = ['.js', 'tsx', '.jsx', '.json']
  return config;
})