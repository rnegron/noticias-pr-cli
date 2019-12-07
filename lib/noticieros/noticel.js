'use strict';

const logger = require('debug')('noticieros:noticel');
const xray = require('../xray');

module.exports = async (site = 'https://www.noticel.com/') => {
  const primeraPlana = await xray(site, '.mod-content .story-wrapper .headline', [
    {
      title: 'a | trim | parse',
      link: 'a@href | trim',
    },
  ]);

  logger('Primera Plana: %O', primeraPlana);

  return [...primeraPlana];
};
