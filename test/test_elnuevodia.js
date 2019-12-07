const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const nock = require('nock');

const siteParser = require('../lib/noticieros/elnuevodia');

const siteUrl = 'https://www.elnuevodia.com';

describe('parsing el nuevo dia articles', function() {
  context('having internet connection and articles being available', function() {
    const html = fs.readFileSync(
      path.join(__dirname, 'files', 'elnuevodia.html'),
      'utf8'
    );
    beforeEach(() => {
      nock(siteUrl)
        .get('/')
        .reply(200, html);
    });

    it('should return the leading article', async function() {
      const response = await siteParser();

      expect(response)
        .to.be.an('array')
        .and.have.lengthOf(3);

      const leadingArticle = response[0];
      expect(leadingArticle)
        .to.be.an('object')
        .and.to.have.all.keys('title', 'summary', 'link', 'paywall');

      expect(leadingArticle.title).to.be.equal(
        'Breaking: "Hacer pruebas en código dismunye los bugs"'
      );

      expect(leadingArticle.summary).to.be.equal('Vale la pena');
      expect(leadingArticle.link).to.be.equal(
        'https://www.elnuevodia.com/noticias/pruebas-codigo-menos-bugs'
      );
    });

    it('should return the secondary articles', async function() {
      const response = await siteParser();

      const firstSecondaryArticle = response[1];
      expect(firstSecondaryArticle)
        .to.be.an('object')
        .and.to.have.all.keys('title', 'summary', 'link', 'paywall');
      expect(firstSecondaryArticle.title).to.be.equal(
        'El representante de la cámara de pruebas guíaba carro hurtado'
      );
      expect(firstSecondaryArticle.summary).to.be.equal(
        `El individuo invadió el carril contrario de la PR-UEBA,
                      ocasionando el choque de otras cinco pruebas.`
      );
      expect(firstSecondaryArticle.link).to.be.equal(
        'https://www.elnuevodia.com/noticias/representante-guiaba-carro-robado/'
      );

      const secondSecondaryArticle = response[2];
      expect(secondSecondaryArticle)
        .to.be.an('object')
        .and.to.have.all.keys('title', 'summary', 'link', 'paywall');

      expect(secondSecondaryArticle.title).to.be.equal(
        'Mejoran las pruebas en la capital de Pruebalandia'
      );

      expect(secondSecondaryArticle.summary).to.be.equal(
        'La presidente de Pruebalandia se expresó'
      );
      expect(secondSecondaryArticle.link).to.be.equal(
        'https://www.elnuevodia.com/noticias/pruebalandia-mejora/'
      );
    });
  });

  context('paywalled articles being available', function() {
    const html = fs.readFileSync(
      path.join(__dirname, 'files', 'elnuevodia-paywall.html'),
      'utf8'
    );
    beforeEach(() => {
      nock(siteUrl)
        .get('/')
        .reply(200, html);
    });

    it('should not return articles which are behind a paywall', async function() {
      const response = await siteParser();

      expect(response)
        .to.be.an('array')
        .and.have.lengthOf(2);
    });
  });
});
