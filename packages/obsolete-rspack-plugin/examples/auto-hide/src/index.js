document.getElementById('app').innerHTML = `
  <h1>Auto Hide Demo</h1>
  <p>This page demonstrates the <strong>autoHide</strong> and <strong>closable</strong> options.</p>
  <p>The prompt bar will automatically disappear after <strong>6 seconds</strong>.
    Since <code>closable</code> is <code>false</code>, there is no close button.</p>
  <h2>Configuration</h2>
  <pre><code>new ObsoleteRspackPlugin({
  autoHide: 6000,
  closable: false,
  zIndex: 100000,
  containerStyle: 'background:#f8d7da;color:#721c24;padding:16px 20px;font-size:15px;text-align:center;border-bottom:2px solid #f5c6cb',
  promptOnNonTargetBrowser: true,
})</code></pre>
  <h2>How it works</h2>
  <ul>
    <li><code>autoHide: 6000</code> &mdash; the prompt is removed from the DOM after 6 seconds</li>
    <li><code>closable: false</code> &mdash; default template omits the close button</li>
    <li>Both options can be combined: users can manually close <em>or</em> wait for auto-dismiss</li>
  </ul>
`;
