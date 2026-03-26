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
      title: 'Basic Demo - obsolete-rspack-plugin',
      template: path.resolve(__dirname, '../shared/template.html'),
    }),
    new ObsoleteRspackPlugin({
      browsers: ['ie 11'],
      promptOnNonTargetBrowser: true,
    }),
  ],
  devServer: {
    port: 3001,
  },
};
