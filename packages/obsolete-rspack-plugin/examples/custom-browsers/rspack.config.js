const path = require('path');
const { HtmlRspackPlugin } = require('@rspack/core');
const ObsoleteRspackPlugin = require('../../src');

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlRspackPlugin({
      title: 'Custom Browsers Demo - obsolete-rspack-plugin',
      template: path.resolve(__dirname, '../shared/template.html'),
    }),
    new ObsoleteRspackPlugin({
      browsers: ['chrome >= 120', 'firefox >= 120', 'safari >= 17', 'edge >= 120'],
      promptOnNonTargetBrowser: true,
      promptOnUnknownBrowser: true,
      position: 'beforeend',
    }),
  ],
  devServer: {
    port: 3003,
  },
};
