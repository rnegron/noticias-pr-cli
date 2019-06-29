'use strict';

const logger = require('debug')('noticieros:noticel');
const xray = require('../xray');

const site = 'https://www.noticel.com';

module.exports = async () => {
  const primeraPlana = await xray(site, '.mod-content .story-wrapper .headline', [
    {
      title: 'a | trim | parse',
      link: 'a@href | trim'
    }
  ]);

  logger('Primera Plana: %O', primeraPlana);

  return [...primeraPlana];
};
