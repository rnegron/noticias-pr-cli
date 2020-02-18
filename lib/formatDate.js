'use strict';

const { format, parseISO } = require('date-fns');

module.exports = date => {
  return date ? format(parseISO(date), 'd/M/yyyy') : 'N/A';
};
