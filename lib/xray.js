'use strict';

const parse = require('./parse');

module.exports = require('x-ray')({
  filters: {
    trim: value => value.trim(),
    parse: value => parse(value),
  },
});
