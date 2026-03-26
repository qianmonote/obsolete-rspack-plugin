const path = require('path');
const { HtmlRspackPlugin } = require('@rspack/core');
const ObsoleteRspackPlugin = require('../../src');

const customTemplate = `
<style>
  .obsolete-banner {
    position: fixed; top: 0; left: 0; right: 0; z-index: 99999;
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: #fff; padding: 16px 24px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 15px; display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  .obsolete-banner button {
    background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4);
    color: #fff; padding: 6px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;
  }
  .obsolete-banner button:hover { background: rgba(255,255,255,0.3); }
</style>
<div class="obsolete-banner">
  <span>Your browser is outdated and may not support all features. Please upgrade for the best experience.</span>
  <button id="obsoleteClose">Dismiss</button>
</div>
`.replace(/\n/g, '');

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
      title: 'Custom Template Demo - obsolete-rspack-plugin',
      template: path.resolve(__dirname, '../shared/template.html'),
    }),
    new ObsoleteRspackPlugin({
      template: customTemplate,
      position: 'afterbegin',
      promptOnNonTargetBrowser: true,
    }),
  ],
  devServer: {
    port: 3002,
  },
};
