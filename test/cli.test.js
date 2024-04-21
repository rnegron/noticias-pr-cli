import fs from 'fs';
import path from 'path';
import { URL } from 'url';

import { jest } from '@jest/globals';
import nock from 'nock';
import Parser from '@postlight/parser';

// Module to test
import cli from '../cli.js';

const __dirname = new URL('.', import.meta.url).pathname;

describe('retrieving news site choices', function () {
  it('should return an array of objects with particular keys', async function () {
    const newsSiteChoices = await cli.retrieveNewsSiteChoices();
    expect(typeof newsSiteChoices).toBe('object');

    for (const newsSiteChoice of newsSiteChoices) {
      expect(Object.keys(newsSiteChoice)).toEqual(
        expect.arrayContaining(['title', 'value'])
      );
    }
  });
});

describe('retrieving articles from a news site', function () {
  beforeEach(function () {
    nock.disableNetConnect();
  });

  afterEach(function () {
    nock.enableNetConnect();
  });

  describe('chose el nuevo dia', function () {
    const html = fs.readFileSync(
      path.join(__dirname, 'files', 'elnuevodia.html'),
      'utf8'
    );
    const siteUrl = 'https://www.elnuevodia.com/';
    const site = 'www.elnuevodia.com';

    beforeEach(function () {
      nock(siteUrl).persist().get('/').reply(200, html);
    });

    afterEach(function () {
      nock.cleanAll();
    });

    it('should return three articles with respective URLs', async function () {
      const articlesAvailable = await cli.retrieveArticlesAvailable(site);
      expect(Array.isArray(articlesAvailable)).toBe(true);
      expect(articlesAvailable).toHaveLength(4);

      expect(Object.keys(articlesAvailable[0])).toEqual(
        expect.arrayContaining(['title', 'value'])
      );

      expect(articlesAvailable[0].value).toBe(
        'https://www.elnuevodia.com/noticias/pruebas-codigo-menos-bugs'
      );
    });
  });
});

describe('retrieving parsed article data from an article', function () {
  beforeAll(function () {
    nock.disableNetConnect();
  });

  afterAll(function () {
    nock.enableNetConnect();
  });

  describe('having already chosen an article from el nuevo dia', function () {
    beforeAll(function () {
      jest.spyOn(Parser, 'parse').mockImplementation(() => {
        return {
          title: 'Breaking: "Hacer pruebas en código dismunye los bugs"',
          author: null,
          date_published: '2019-03-03T04:00:00.000Z',
          dek: null,
          lead_image_url: 'https://noticias.pr/primera/flag.png',
          content: '',
          next_page_url: null,
          url: 'https://www.elnuevodia.com/noticias/pruebas-codigo-menos-bugs/',
          domain: 'www.elnuevodia.com',
          excerpt: 'Vale la pena',
          word_count: 0,
          direction: 'ltr',
          total_pages: 1,
          rendered_pages: 1,
        };
      });
    });

    afterEach(function () {
      nock.cleanAll();
    });

    it('should return an object representing the parsed article', async function () {
      const articleData = await cli.retrieveArticleData(
        'https://www.elnuevodia.com/noticias/pruebas-codigo-menos-bugs/'
      );

      expect(Object.keys(articleData)).toEqual(
        expect.arrayContaining([
          'title',
          'author',
          'date_published',
          'dek',
          'lead_image_url',
          'content',
          'next_page_url',
          'url',
          'domain',
          'excerpt',
          'word_count',
          'direction',
          'total_pages',
          'rendered_pages',
        ])
      );
    });

    it('should obtain the article lead image', async function () {
      const imageScope = nock('https://noticias.pr/primera')
        .get('/flag.png')
        .replyWithFile(200, path.join(__dirname, 'files', 'flag.png'));

      const articleData = await cli.retrieveArticleData(
        'https://www.elnuevodia.com/noticias/pruebas-codigo-menos-bugs/'
      );

      await cli.retrieveArticleImage(articleData);

      expect(imageScope.isDone()).toBe(true);
    });
  });
});
