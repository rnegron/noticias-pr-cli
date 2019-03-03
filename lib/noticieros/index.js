'use strict';

const elnuevodia = require('./elnuevodia');
const primerahora = require('./primerahora');

// Export all available news sites here
module.exports = async site => {
  switch (site) {
    case 'www.elnuevodia.com':
      return elnuevodia();
    case 'www.primerahora.com':
      return primerahora();
    default:
      throw new Error('Invalid site selected');
  }
};
