'use strict';

const logger = require('debug')('noticieros:endi');
const xray = require('../xray');

module.exports = async (site = 'https://www.elnuevodia.com/') => {
  const data = await xray(site, '#home_bloquepriorizado__bloque___stageprincipal', {
    primeraPlana: xray('.bk4-8of12 .featured-stories-primary article', [
      {
        title: '.story-tease-title a | trim',
        summary: '.story-tease-summary p | trim',
        link: '.story-tease-title a@href | trim',
        paywall: '.story-tease-category | trim | checkPaywall',
      },
    ]),

    segundaPlana: xray('.bk4-8of12 .featured-stories-secondary article', [
      {
        title: '.story-tease-title a | trim',
        summary: '.story-tease-summary p | trim',
        link: '.story-tease-title a@href | trim',
        paywall: '.story-tease-category | trim | checkPaywall',
      },
    ]),
  });

  logger('Articulos: %O', {
    primeraPlana: data.primeraPlana,
    segundaPlana: data.segundaPlana,
  });

  return [
    ...data.primeraPlana.filter((article) => !article.paywall),
    ...data.segundaPlana.filter((article) => !article.paywall),
  ];
};
