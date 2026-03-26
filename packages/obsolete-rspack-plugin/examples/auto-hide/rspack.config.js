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
      title: 'Auto Hide Demo - obsolete-rspack-plugin',
      template: path.resolve(__dirname, '../shared/template.html'),
    }),
    new ObsoleteRspackPlugin({
      browsers: ['ie 11'],
      autoHide: 6000,
      closable: false,
      zIndex: 100000,
      containerStyle:
        'background:#f8d7da;color:#721c24;padding:16px 20px;font-size:15px;text-align:center;border-bottom:2px solid #f5c6cb',
      promptOnNonTargetBrowser: true,
    }),
  ],
  devServer: {
    port: 3005,
  },
};
