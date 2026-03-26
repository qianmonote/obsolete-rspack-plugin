const path = require('path');
const rspack = require('@rspack/core');

function buildFixture(name) {
  return new Promise((resolve, reject) => {
    const context = path.resolve(__dirname, `../fixtures/${name}`);
    const configPath = path.resolve(context, 'rspack.config.js');
    const config = {
      mode: 'development',
      context,
      output: {
        path: path.resolve(context, 'dist'),
      },
      ...require(configPath),
    };

    rspack(config, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }
      if (stats.hasErrors()) {
        reject(new Error(stats.toString({ colors: false })));
        return;
      }
      resolve(context);
    });
  });
}

module.exports = { buildFixture };
