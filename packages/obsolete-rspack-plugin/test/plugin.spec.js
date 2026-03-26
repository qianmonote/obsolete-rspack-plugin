const path = require('path');
const { rmSync } = require('fs');
const { buildFixture } = require('./helpers/bundler');
const { readFile } = require('./helpers/fs');
const { getLibraryContent } = require('./helpers/library');

function cleanFixtureDist() {
  ['default', 'options', 'html'].forEach(name => {
    const dist = path.resolve(__dirname, `fixtures/${name}/dist`);

    try {
      rmSync(dist, { recursive: true, force: true });
    } catch (_) {}
  });
}

describe('ObsoleteRspackPlugin', () => {
  beforeAll(() => cleanFixtureDist());

  it('default: emits obsolete.js with library + default options', async () => {
    const context = await buildFixture('default');
    const content = readFile(context, 'dist', 'obsolete.js');
    const libraryContent = getLibraryContent();

    expect(content.startsWith(libraryContent)).toBe(true);

    const appended = content.slice(libraryContent.length);

    expect(appended).toContain("new Obsolete(");
    expect(appended).toContain("position: 'afterbegin'");
    expect(appended).toContain('promptOnNonTargetBrowser: false');
    expect(appended).toContain('promptOnUnknownBrowser: true');
    expect(appended).toContain('.test(');
  });

  it('options: emits outdated.js with custom name/template/browsers', async () => {
    const context = await buildFixture('options');
    const content = readFile(context, 'dist', 'outdated.js');
    const libraryContent = getLibraryContent();

    expect(content.startsWith(libraryContent)).toBe(true);

    const appended = content.slice(libraryContent.length);

    expect(appended).toContain("template: '<div>Hello</div>'");
    expect(appended).toContain("position: 'beforeend'");
    expect(appended).toContain('promptOnNonTargetBrowser: true');
    expect(appended).toContain('promptOnUnknownBrowser: false');
    expect(appended).toContain("'chrome 9'");
  });

  it('html: injects <script> tag into HTML output via HtmlRspackPlugin', async () => {
    const context = await buildFixture('html');
    const html = readFile(context, 'dist', 'index.html');

    expect(html).toContain('<script');
    expect(html).toContain('obsolete.js');

    // The obsolete script should be injected into <body> at the afterbegin position
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);

    expect(bodyMatch).not.toBeNull();

    const bodyContent = bodyMatch[1];

    expect(bodyContent).toContain('obsolete.js');
    // obsolete.js should appear at the very start of <body>
    expect(bodyContent.indexOf('obsolete.js')).toBeLessThan(bodyContent.length / 2);
  });
});
