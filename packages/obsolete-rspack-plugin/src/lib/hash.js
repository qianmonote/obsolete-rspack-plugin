const crypto = require('crypto');

/**
 * @param {string} content
 * @returns {string}
 */
function createHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

module.exports = {
  createHash,
};
