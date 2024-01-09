const path = require('node:path');
const { override, addBabelPlugin } = require('customize-cra');

module.exports = override(addBabelPlugin('babel-plugin-styled-components'));
module.exports = function override(config, environment) {
  config.resolve.alias['@'] = path.resolve(__dirname, 'src');
  return config;
};
