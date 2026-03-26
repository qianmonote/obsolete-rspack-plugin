document.getElementById('app').innerHTML = `
  <h1>Custom Template Demo</h1>
  <p>This page uses a <strong>custom styled prompt template</strong> to show the browser upgrade notice.</p>
  <p>The prompt uses a gradient background, rounded corners, and a custom close button.</p>
  <h2>Configuration</h2>
  <pre><code>new ObsoleteRspackPlugin({
  template: '&lt;style&gt;...&lt;/style&gt;&lt;div&gt;...&lt;/div&gt;',
  position: 'afterbegin',
  promptOnNonTargetBrowser: true,
})</code></pre>
  <p>Since <code>promptOnNonTargetBrowser</code> is <code>true</code>, the prompt will show on any browser
  that is not explicitly in the target list (including modern Chrome/Safari/Firefox).</p>
`;
