import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import nock from 'nock';
import { URL } from 'url';

import siteParser from '../lib/noticieros/noticel.js';

const siteUrl = 'https://www.noticel.com/';

const __dirname = new URL('.', import.meta.url).pathname;

describe('parsing noticel articles', function () {
  context('having internet connection and articles being available', function () {
    const html = fs.readFileSync(path.join(__dirname, 'files', 'noticel.html'), 'utf8');
    beforeEach(() => {
      nock(siteUrl).get('/').reply(200, html);
    });

    it('should return the leading articles', async function () {
      const response = await siteParser();

      for (const article of response) {
        expect(article).to.be.an('object').and.to.have.all.keys('title', 'link');
      }

      expect(response[0].title).to.be.equal(
        'Breaking: "Hacer pruebas en código dismunye los bugs"'
      );
      expect(response[0].link).to.be.equal(
        'https://www.noticel.com/pruebas-codigo-menos-bugs/'
      );

      expect(response[1].title).to.be.equal(
        'El representante de la cámara de pruebas guíaba carro hurtado'
      );
      expect(response[1].link).to.be.equal(
        'https://www.noticel.com/representante-guiaba-carro-robado/'
      );

      expect(response[2].title).to.be.equal(
        'Mejoran las pruebas en la capital de Pruebalandia'
      );
      expect(response[2].link).to.be.equal(
        'https://www.noticel.com/pruebalandia-mejora/'
      );
    });
  });
});
