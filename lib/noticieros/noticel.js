'use strict';

const logger = require('debug')('noticieros:noticel');
const xray = require('../xray');

module.exports = async (site = 'https://www.noticel.com/') => {
  const data = await xray(site, {
    primeraPlana: xray(
      site,
      '.topstories_section_main .frontpagefeaturedtop-main-title',
      [
        {
          title: 'a .teaser__headline-marker | trim | parse',
          link: 'a@href | trim',
        },
      ]
    ),

    segundaPlana: xray(site, '.Ahora .article-list-container .article-list-item', [
      {
        title: 'a | trim | parse',
        link: 'a@href | trim',
      },
    ]),
  });

  logger('Articulos: %O', {
    primeraPlana: data.primeraPlana,
    segundaPlana: data.segundaPlana,
  });

  return [...data.primeraPlana, ...data.segundaPlana];
};
