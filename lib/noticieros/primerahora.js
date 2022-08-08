import debug from 'debug';
import xray from '../xray.js';

const logger = debug('noticieros:primerahora');

export default async (site = 'https://www.primerahora.com/noticias/') => {
  const newsArticles = await xray(site, '.main-content .noticias article', [
    {
      title: 'h2 a | trim',
      summary: 'p a.c01 a | trim',
      link: 'h2 a@href | trim',
    },
  ]);
  logger('Artículos: %O', newsArticles);

  // Return the first 5 articles
  return newsArticles.slice(0, 5);
};
