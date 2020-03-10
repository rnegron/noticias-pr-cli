'use strict';

const fs = require('fs');
const path = require('path');

const nock = require('nock');
const expect = require('chai').expect;
const sinon = require('sinon');
const Mercury = require('@postlight/mercury-parser');

// Module to test
const cli = require('../cli');

describe('retrieving news site choices', function() {
  it('should return an array of objects with particular keys', async function() {
    const newsSiteChoices = await cli.retrieveNewsSiteChoices();
    expect(newsSiteChoices).to.be.an('array');

    for (const newsSiteChoice of newsSiteChoices) {
      expect(newsSiteChoice).to.include.all.keys('title', 'value');
    }
  });
});

describe('retrieving articles from a news site', function() {
  before(function() {
    nock.disableNetConnect();
  });

  after(function() {
    nock.enableNetConnect();
  });

  context('chose el nuevo dia', function() {
    const html = fs.readFileSync(
      path.join(__dirname, 'files', 'elnuevodia.html'),
      'utf8'
    );
    const siteUrl = 'https://www.elnuevodia.com/';
    const site = 'www.elnuevodia.com';

    beforeEach(function() {
      nock(siteUrl)
        .persist()
        .get('/')
        .reply(200, html);
    });

    afterEach(function() {
      nock.cleanAll();
    });

    it('should return three articles with respective URLs', async function() {
      const articlesAvailable = await cli.retrieveArticlesAvailable(site);
      expect(articlesAvailable)
        .to.be.an('array')
        .and.to.have.lengthOf(4);

      expect(articlesAvailable[0]).to.have.all.keys('title', 'value');

      expect(articlesAvailable[0].value).to.equal(
        'https://www.elnuevodia.com/noticias/pruebas-codigo-menos-bugs'
      );
    });
  });
});

describe('retrieving parsed article data from an article', async function() {
  before(function() {
    nock.disableNetConnect();
  });

  after(function() {
    nock.enableNetConnect();
  });

  context('having already chosen an article from el nuevo dia', function() {
    before(function() {
      sinon.stub(Mercury, 'parse').callsFake(() => {
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

    afterEach(function() {
      nock.cleanAll();
    });

    it('should return an object representing the parsed article', async function() {
      const articleData = await cli.retrieveArticleData(
        'https://www.elnuevodia.com/noticias/pruebas-codigo-menos-bugs/'
      );

      expect(articleData)
        .to.be.an('object')
        .and.to.have.all.keys(
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
          'rendered_pages'
        );
    });

    it('should obtain the article lead image', async function() {
      const imageScope = nock('https://noticias.pr/primera')
        .get('/flag.png')
        .replyWithFile(200, path.join(__dirname, 'files', 'flag.png'));

      const articleData = await cli.retrieveArticleData(
        'https://www.elnuevodia.com/noticias/pruebas-codigo-menos-bugs/'
      );

      await cli.retrieveArticleImage(articleData);

      expect(imageScope.isDone()).to.equal(true);
    });
  });
});
