'use strict';

const parse = require('./filters/parse');
const checkPaywall = require('./filters/check-paywall');

module.exports = require('x-ray')({
  filters: {
    trim: value => value.trim(),
    parse: value => parse(value),
    checkPaywall: value => checkPaywall(value),
  },
});
