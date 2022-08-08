import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import nock from 'nock';
import { URL } from 'url';

import siteParser from '../lib/noticieros/primerahora.js';

const siteUrl = 'https://www.primerahora.com/noticias/';

const __dirname = new URL('.', import.meta.url).pathname;

describe('parsing primera hora articles', function () {
  context('having internet connection and articles being available', function () {
    const html = fs.readFileSync(
      path.join(__dirname, 'files', 'primerahora.html'),
      'utf8'
    );
    beforeEach(() => {
      nock(siteUrl).get('/').reply(200, html);
    });

    it('should return the articles', async function () {
      const response = await siteParser();

      expect(response).to.be.an('array').and.have.lengthOf(3);
      for (const article of response) {
        expect(article).to.be.an('object').and.to.have.all.keys('title', 'link');
      }
      expect(response[0].title).to.be.equal(
        'Breaking: "Hacer pruebas en código dismunye los bugs"'
      );
      expect(response[0].link).to.be.equal(
        'https://www.primerahora.com/noticias/pruebas-codigo-menos-bugs/'
      );
      expect(response[1].title).to.be.equal(
        'El representante de la cámara de pruebas guíaba carro hurtado'
      );
      expect(response[1].link).to.be.equal(
        'https://www.primerahora.com/noticias/representante-guiaba-carro-robado/'
      );

      expect(response[2].title).to.be.equal(
        'Mejoran las pruebas en la capital de Pruebalandia'
      );
      expect(response[2].link).to.be.equal(
        'https://www.primerahora.com/noticias/pruebalandia-mejora/'
      );
    });
  });
});
