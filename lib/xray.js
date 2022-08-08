import xray from 'x-ray';

import parse from './filters/parse.js';
import checkPaywall from './filters/check-paywall.js';

export default xray({
  filters: {
    trim: (value) => value.trim(),
    parse: (value) => parse(value),
    checkPaywall: (value) => checkPaywall(value),
  },
});
