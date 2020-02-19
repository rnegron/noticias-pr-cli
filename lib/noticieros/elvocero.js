'use strict';

const logger = require('debug')('noticieros:elvocero');
const xray = require('../xray');

module.exports = async (site = 'https://www.elvocero.com/') => {
  const newsArticles = await xray(
    site,
    '#tncms-region-front-featured-top .tnt-headline',
    [
      {
        title: 'a.tnt-asset-link | trim',
        link: 'a.tnt-asset-link@href',
      },
    ]
  );
  logger('Artículos: %O', newsArticles);

  // Return the first 5 articles
  return newsArticles.slice(0, 5);
};
