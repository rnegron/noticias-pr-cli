import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import nock from 'nock';
import { URL } from 'url';

import siteParser from '../lib/noticieros/elvocero.js';

const siteUrl = 'https://www.elvocero.com/';

const __dirname = new URL('.', import.meta.url).pathname;

describe('parsing el vocero articles', function () {
  context('having internet connection and articles being available', function () {
    const html = fs.readFileSync(
      path.join(__dirname, 'files', 'elvocero.html'),
      'utf8'
    );
    beforeEach(() => {
      nock(siteUrl).get('/').reply(200, html);
    });

    it('should return the articles', async function () {
      const response = await siteParser();

      expect(response).to.be.an('array').and.have.lengthOf(5);
      for (const article of response) {
        expect(article).to.be.an('object').and.to.have.all.keys('title', 'link');
      }
      expect(response[0].title).to.be.equal(
        'Dr. Pruebito descubre químico para eliminar los bugs'
      );

      expect(response[0].link).to.be.equal(
        'https://www.elvocero.com/noticia_rotary/01.html'
      );

      expect(response[1].title).to.be.equal(
        'La ONU declara Pruebalandia como patrimonio de la humanidad'
      );
      expect(response[1].link).to.be.equal(
        'https://www.elvocero.com/noticia_rotary/02.html'
      );

      expect(response[2].title).to.be.equal(
        'El parlamento pruebalandino decide hacer frente a los bugs'
      );

      expect(response[2].link).to.be.equal(
        'https://www.elvocero.com/noticia_rotary/03.html'
      );

      expect(response[3].title).to.be.equal(
        'Breaking: "Las pruebas son tediosas, pero útiles"'
      );
      expect(response[3].link).to.be.equal(
        'https://www.elvocero.com/noticia_rotary/04.html'
      );

      expect(response[4].title).to.be.equal('Tráfico severo en la PR-UEBA');

      expect(response[4].link).to.be.equal(
        'https://www.elvocero.com/noticia_rotary/05.html'
      );
    });
  });
});
