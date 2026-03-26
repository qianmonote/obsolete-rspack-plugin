const { HtmlRspackPlugin } = require('@rspack/core');
const Plugin = require('../../../src');

module.exports = {
  plugins: [new HtmlRspackPlugin(), new Plugin()],
};
