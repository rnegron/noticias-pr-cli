import ansiEscapes from 'ansi-escapes';

/* istanbul ignore next */
export default () => {
  process.stdout.write(ansiEscapes.clearScreen);
  process.exit(0);
};
