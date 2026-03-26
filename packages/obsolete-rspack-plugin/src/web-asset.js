const { readFileAsync } = require('./lib/async-fs');
const { createHash } = require('./lib/hash');
const { removeEmptyValues } = require('./lib/filter');
const { indent, stringify } = require('./lib/formatter');

class WebAsset {
  /**
   * @param {string} sourcePath
   * @param {string} filename
   */
  constructor(sourcePath, filename) {
    this.sourcePath = sourcePath;
    this.filename = filename;
    this.fileContent = '';
  }
  /**
   * Generate client code with defined variables.
   *
   * @param {Object} context Variables populated to template.
   */
  async populate(context) {
    this.fileContent = await readFileAsync(this.sourcePath, 'utf-8');
    this.fileContent = this.composeCode(context);
  }
  /**
   * Format filename with placeholder of `[name]` and `[hash]`.
   *
   * @param {string} name The chunk name to replace RegExp.
   */
  hash(name) {
    this.filename = this.filename
      .replace(/\[name\]/gi, name)
      .replace(/\[id\]/gi, name)
      .replace(/\[(?:content|chunk|)hash(?::(\d+))?\]/gi, (...matches) => {
        const hash = createHash(this.fileContent);

        return matches[1] ? hash.substr(0, Number(matches[1])) : hash;
      });
  }
  /**
   * Get code which is supposed to being appended to the bottom of library.
   *
   * @param {Object} context Variables populated to template.
   * @param {string[]} context.browsers Must be the output of `browserslist`.
   * @param {string} [context.template]
   * @param {string} [context.position]
   * @param {boolean} [context.promptOnNonTargetBrowser]
   * @param {boolean} [context.promptOnUnknownBrowser]
   * @param {number} [context.autoHide] Auto-dismiss delay in ms.
   * @returns {string}
   */
  composeCode(context) {
    const options = {
      template: context.template,
      position: context.position,
      promptOnNonTargetBrowser: context.promptOnNonTargetBrowser,
      promptOnUnknownBrowser: context.promptOnUnknownBrowser,
    };
    const slimOptions = removeEmptyValues(options);
    const lines = [];

    lines.push(indent(`(function() {`, 0));
    lines.push(indent(`'use strict';`, 2));

    // Runtime dedup guard
    lines.push(indent(`if (window.__obsolete_prompted__) return;`, 2));
    lines.push(indent(`window.__obsolete_prompted__ = true;`, 2));

    if (context.autoHide > 0) {
      // Use the `done` callback of Obsolete.test() to start auto-hide timer
      lines.push(indent(
        `new Obsolete(${stringify(slimOptions)}).test(${stringify(context.browsers)}, function() {`,
        2
      ));
      lines.push(indent(`setTimeout(function() {`, 4));
      lines.push(indent(`var c = document.getElementById('obsoleteContainer');`, 6));
      lines.push(indent(`if (c) c.parentNode.removeChild(c);`, 6));
      lines.push(indent(`}, ${context.autoHide});`, 4));
      lines.push(indent(`});`, 2));
    } else {
      lines.push(indent(
        `new Obsolete(${stringify(slimOptions)}).test(${stringify(context.browsers)});`,
        2
      ));
    }

    lines.push(indent(`})();\n`, 0));

    return this.fileContent + lines.join('\n');
  }
}

module.exports = WebAsset;
