'use strict';

const logger = require('debug')('noticieros:primerahora');
const xray = require('../xray');

const site = 'https://www.primerahora.com/noticias';

module.exports = async () => {
  const newsArticles = await xray(
    site,
    '.main-content .noticias article', [
      {
        title: 'h2 a | trim',
        summary: 'p a.c01 a | trim',
        link: 'h2 a@href | trim'
      }
    ]
  );
  logger('Artículos: %O', newsArticles);

  // Return the first 5 articles
  return newsArticles.slice(0, 5);
};
