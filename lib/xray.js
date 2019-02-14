'use strict';

module.exports = require('x-ray')({
  filters: {
    trim: value => value.trim()
  }
});
