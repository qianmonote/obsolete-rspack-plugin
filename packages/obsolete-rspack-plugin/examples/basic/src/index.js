document.getElementById('app').innerHTML = `
  <h1>Basic Demo</h1>
  <p>This page uses <code>obsolete-rspack-plugin</code> with <strong>default options</strong>.</p>
  <p>If your browser does not meet the browserslist target, a prompt bar will appear at the top of the page.</p>
  <h2>Configuration</h2>
  <pre><code>new ObsoleteRspackPlugin()</code></pre>
  <p>Default browserslist configuration from the project root is used.</p>
`;
