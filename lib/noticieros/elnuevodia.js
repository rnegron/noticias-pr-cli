'use strict';

const logger = require('debug')('noticieros:endi');
const xray = require('../xray');

module.exports = async (site = 'https://www.elnuevodia.com/') => {
  const primeraPlana = await xray(
    site,
    '.bk4-8of12 .featured-stories-primary article',
    [
      {
        title: '.story-tease-title a | trim',
        summary: '.story-tease-summary p | trim',
        link: '.story-tease-title a@href | trim',
        paywall: '.story-tease-category | trim | checkPaywall',
      },
    ]
  );

  logger('Primera Plana: %O', primeraPlana);

  const segundaPlana = await xray(
    site,
    '.bk4-8of12 .featured-stories-secondary article',
    [
      {
        title: '.story-tease-title a | trim',
        summary: '.story-tease-summary p | trim',
        link: '.story-tease-title a@href | trim',
        paywall: '.story-tease-category | trim | checkPaywall',
      },
    ]
  );

  logger('Segunda Plana: %O', segundaPlana);

  return [
    ...primeraPlana.filter(article => !article.paywall),
    ...segundaPlana.filter(article => !article.paywall),
  ];
};
