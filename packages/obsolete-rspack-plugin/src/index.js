const { resolve } = require('path');
const browserslist = require('browserslist');
const WebAsset = require('./web-asset');

const DEFAULT_TEMPLATE_WITH_CLOSE =
  '<div>Your browser is not supported. <button id="obsoleteClose">&times;</button></div>';
const DEFAULT_TEMPLATE_WITHOUT_CLOSE =
  '<div>Your browser is not supported.</div>';

class ObsoleteRspackPlugin {
  /**
   * @param {Object} [options]
   * @param {string} [options.name='obsolete'] The chunk name.
   * @param {string} [options.template] The prompt html template. It accepts any document fragment.
   *   Specially, the template will be removed when a node with attribute `id="obsoleteClose"` is clicked.
   * @param {string} [options.position='afterbegin'] If set 'afterbegin', the template will be injected
   *   into the start of body. If set 'beforeend', the template will be injected into the end of body.
   * @param {string[]} [options.browsers] Browsers to support, overriding global browserslist configuration.
   * @param {boolean} [options.promptOnNonTargetBrowser=false] If the current browser useragent
   *   doesn't match one of the target browsers, it's considered as unsupported. Thus, the prompt
   *   will be shown.
   * @param {boolean} [options.promptOnUnknownBrowser=true] If the current browser useragent is
   *   unknown, the prompt will be shown.
   * @param {number} [options.zIndex] The z-index value for the prompt container.
   * @param {string} [options.containerStyle] Additional inline CSS for the prompt container,
   *   e.g. `'background:#fff3cd;padding:12px;font-size:14px'`. Will be merged with zIndex.
   * @param {string} [options.containerClass] CSS class name(s) applied to the prompt container,
   *   e.g. `'obsolete-bar'` or `'obsolete-bar warning'`.
   * @param {number} [options.autoHide] Auto-dismiss the prompt after the given milliseconds,
   *   e.g. `5000` will hide the bar after 5 seconds.
   * @param {boolean} [options.closable=false] Whether to show the close button in the default
   *   template. Only takes effect when `template` is not provided. Defaults to true.
   */
  constructor(options) {
    this.options = {
      name: 'obsolete',
      position: 'afterbegin',
      promptOnNonTargetBrowser: false,
      promptOnUnknownBrowser: true,
      closable: false,
      ...options,
    };

    this._resolvedFilename = null;
  }

  /**
   * @param {import('@rspack/core').Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.compilation.tap(this.constructor.name, compilation => {
      const { PROCESS_ASSETS_STAGE_ADDITIONAL } = compiler.webpack.Compilation;

      compilation.hooks.processAssets.tapPromise(
        {
          name: this.constructor.name,
          stage: PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => this.processAssets(compiler, compilation)
      );

      const { HtmlRspackPlugin } = compiler.webpack;

      if (HtmlRspackPlugin && typeof HtmlRspackPlugin.getCompilationHooks === 'function') {
        HtmlRspackPlugin.getCompilationHooks(compilation).beforeEmit.tapAsync(
          this.constructor.name,
          (data, cb) => {
            // Guard: skip if filename not ready or script tag already injected
            if (this._resolvedFilename && !data.html.includes(this._resolvedFilename)) {
              const publicPath = compilation.outputOptions.publicPath || '';
              const normalizedPublicPath =
                publicPath === 'auto' || publicPath === ''
                  ? ''
                  : publicPath.endsWith('/')
                    ? publicPath
                    : publicPath + '/';
              const scriptTag = `<script src="${normalizedPublicPath}${this._resolvedFilename}"></script>`;

              if (this.options.position === 'afterbegin') {
                data.html = data.html.replace(/(<body[^>]*>)/i, `$1${scriptTag}`);
              } else {
                data.html = data.html.replace(/(<\/body>)/i, `${scriptTag}$1`);
              }
            }
            cb(null, data);
          }
        );
      }
    });
  }

  /**
   * @param {import('@rspack/core').Compiler} compiler
   * @param {import('@rspack/core').Compilation} compilation
   */
  async processAssets(compiler, compilation) {
    if (compilation.name) {
      return;
    }

    const webAsset = new WebAsset(
      ObsoleteRspackPlugin.libraryPath,
      this.resolveFilename(compilation)
    );

    const template = this.buildTemplate();

    await webAsset.populate({
      browsers: browserslist(this.options.browsers),
      template,
      position: this.options.position,
      promptOnNonTargetBrowser: this.options.promptOnNonTargetBrowser,
      promptOnUnknownBrowser: this.options.promptOnUnknownBrowser,
      autoHide: this.options.autoHide,
    });
    webAsset.hash(this.options.name);

    this._resolvedFilename = webAsset.filename;

    const { RawSource } = compiler.webpack.sources;

    compilation.emitAsset(webAsset.filename, new RawSource(webAsset.fileContent));
  }

  /**
   * Build the final template string by:
   *   1. Choosing the base template (user-supplied or default based on `closable`)
   *   2. Wrapping it in a container div when `zIndex`, `containerStyle`, or `containerClass` is set
   *
   * @returns {string|undefined}
   */
  buildTemplate() {
    const { template, closable, zIndex, containerStyle, containerClass, autoHide } = this.options;

    // 1. Resolve base template
    let html = template;
    if (!html) {
      html = closable ? DEFAULT_TEMPLATE_WITH_CLOSE : DEFAULT_TEMPLATE_WITHOUT_CLOSE;
    }

    // 2. Determine if we need a wrapper container
    const needsWrapper = zIndex != null || containerStyle || containerClass || autoHide != null;
    if (!needsWrapper) {
      return html;
    }

    // 3. Build inline style
    const styleParts = [];
    if (zIndex != null) {
      styleParts.push(`position:relative`);
      styleParts.push(`z-index:${zIndex}`);
    }
    if (containerStyle) {
      styleParts.push(containerStyle);
    }

    // 4. Build attributes
    const attrs = ['id="obsoleteContainer"'];
    if (styleParts.length > 0) {
      attrs.push(`style="${styleParts.join(';')}"`);
    }
    if (containerClass) {
      attrs.push(`class="${containerClass}"`);
    }

    return `<div ${attrs.join(' ')}>${html}</div>`;
  }

  /**
   * @param {import('@rspack/core').Compilation} compilation
   * @returns {string}
   */
  resolveFilename(compilation) {
    const chunkFilename = compilation.outputOptions.chunkFilename;
    const filename = typeof chunkFilename === 'string' ? chunkFilename : '[name].js';

    return filename.includes('[name]') || filename.includes('[id]')
      ? filename
      : `[name].${filename}`;
  }
}

ObsoleteRspackPlugin.libraryPath = resolve(
  require.resolve('obsolete-web'),
  '../../dist/obsolete.js'
);

module.exports = ObsoleteRspackPlugin;
