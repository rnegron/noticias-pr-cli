'use strict';

const noticel = require('./noticel');
const elnuevodia = require('./elnuevodia');
const primerahora = require('./primerahora');

// Export all available news sites here
module.exports = {
  'www.elnuevodia.com': elnuevodia,
  'www.primerahora.com': primerahora,
  'www.noticel.com': noticel,
};
