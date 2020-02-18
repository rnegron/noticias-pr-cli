'use strict';

const noticel = require('./noticel');
const elnuevodia = require('./elnuevodia');
const primerahora = require('./primerahora');
const elvocero = require('./elvocero');

// Export all available news sites here
module.exports = {
  'www.elnuevodia.com': elnuevodia,
  'www.primerahora.com': primerahora,
  'www.noticel.com': noticel,
  'www.elvocero.com': elvocero,
};
