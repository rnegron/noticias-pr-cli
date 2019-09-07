const ansiEscapes = require('ansi-escapes');

/* istanbul ignore next */
module.exports = () => {
  process.stdout.write(ansiEscapes.clearScreen);
  process.exit(0);
};
