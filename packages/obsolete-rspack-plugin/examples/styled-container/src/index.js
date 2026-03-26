document.getElementById('app').innerHTML = `
  <h1>Styled Container Demo</h1>
  <p>This page demonstrates the <strong>container styling options</strong>:
    <code>zIndex</code>, <code>containerStyle</code>, and <code>containerClass</code>.</p>
  <p>The prompt bar is styled via plugin options without a custom template.</p>
  <h2>Configuration</h2>
  <pre><code>new ObsoleteRspackPlugin({
  zIndex: 99999,
  containerStyle: 'background:#fff3cd;color:#856404;padding:12px 20px;font-size:14px;text-align:center;border-bottom:1px solid #ffc107',
  containerClass: 'browser-upgrade-bar',
  closable: true,
  promptOnNonTargetBrowser: true,
})</code></pre>
  <h2>How it works</h2>
  <ul>
    <li><code>zIndex</code> &mdash; sets <code>position:relative; z-index:99999</code> on the container</li>
    <li><code>containerStyle</code> &mdash; additional inline CSS, merged with zIndex styles</li>
    <li><code>containerClass</code> &mdash; CSS class for external stylesheet control</li>
    <li><code>closable: true</code> &mdash; explicitly enables the close button (default is <code>false</code>)</li>
  </ul>
`;
