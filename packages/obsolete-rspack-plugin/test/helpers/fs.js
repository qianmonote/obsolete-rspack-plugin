const { readdirSync, readFileSync, rmSync } = require('fs');
const path = require('path');

function readFile(...args) {
  return readFileSync(path.resolve(...args), 'utf-8');
}

function readdir(...args) {
  return readdirSync(path.resolve(...args));
}

function cleanDist(fixturesGlob) {
  const glob = require('glob');
  const dirs = glob.sync(fixturesGlob);

  dirs.forEach(dir => {
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch (_) {}
  });
}

module.exports = { readFile, readdir, cleanDist };
