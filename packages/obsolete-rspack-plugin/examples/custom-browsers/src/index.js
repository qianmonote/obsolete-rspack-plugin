document.getElementById('app').innerHTML = `
  <h1>Custom Browsers Demo</h1>
  <p>This page targets very new browser versions using the <code>browsers</code> option.</p>
  <p>If your browser version is below the specified targets, the upgrade prompt will appear.</p>
  <h2>Configuration</h2>
  <pre><code>new ObsoleteRspackPlugin({
  browsers: ['chrome >= 120', 'firefox >= 120', 'safari >= 17', 'edge >= 120'],
  promptOnNonTargetBrowser: true,
  promptOnUnknownBrowser: true,
  position: 'beforeend',
})</code></pre>
  <p><code>position: 'beforeend'</code> places the prompt at the bottom of the page body.</p>
`;
