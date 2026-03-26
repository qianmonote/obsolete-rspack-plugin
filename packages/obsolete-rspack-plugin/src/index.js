const { resolve } = require('path');
const browserslist = require('browserslist');
const WebAsset = require('./web-asset');

class ObsoleteRspackPlugin {
  /**
   * @param {Object} [options]
   * @param {string} [options.name='obsolete'] The chunk name.
   * @param {string} [options.template] The prompt html template. It accepts any document fragment.
   * @param {string} [options.position='afterbegin'] If set 'afterbegin', the template will be injected
   * into the start of body. If set 'beforeend', the template will be injected into the end of body.
   * @param {string[]} [options.browsers] Browsers to support, overriding global browserslist configuration.
   * @param {boolean} [options.promptOnNonTargetBrowser=false] If the current browser useragent
   * doesn't match one of the target browsers, it's considered as unsupported. Thus, the prompt
   * will be shown.
   * @param {boolean} [options.promptOnUnknownBrowser=true] If the current browser useragent is
   * unknown, the prompt will be shown.
   */
  constructor(options) {
    this.options = {
      name: 'obsolete',
      position: 'afterbegin',
      promptOnNonTargetBrowser: false,
      promptOnUnknownBrowser: true,
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
            if (this._resolvedFilename) {
              const scriptTag = `<script src="${this._resolvedFilename}"></script>`;

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

    await webAsset.populate({
      browsers: browserslist(this.options.browsers),
      template: this.options.template,
      position: this.options.position,
      promptOnNonTargetBrowser: this.options.promptOnNonTargetBrowser,
      promptOnUnknownBrowser: this.options.promptOnUnknownBrowser,
    });
    webAsset.hash(this.options.name);

    this._resolvedFilename = webAsset.filename;

    const { RawSource } = compiler.webpack.sources;

    compilation.emitAsset(webAsset.filename, new RawSource(webAsset.fileContent));
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
