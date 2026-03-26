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
      title: 'Styled Container Demo - obsolete-rspack-plugin',
      template: path.resolve(__dirname, '../shared/template.html'),
    }),
    new ObsoleteRspackPlugin({
      zIndex: 99999,
      containerStyle:
        'background:#fff3cd;color:#856404;padding:12px 20px;font-size:14px;text-align:center;border-bottom:1px solid #ffc107',
      containerClass: 'browser-upgrade-bar',
      closable: true,
      promptOnNonTargetBrowser: true,
    }),
  ],
  devServer: {
    port: 3004,
  },
};
