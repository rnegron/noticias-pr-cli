import fs from 'fs';
import path from 'path';
import nock from 'nock';
import { URL } from 'url';

import siteParser from '../lib/noticieros/elnuevodia.js';

const siteUrl = 'https://www.elnuevodia.com';
const __dirname = new URL('.', import.meta.url).pathname;

describe('parsing el nuevo dia articles', function () {
  describe('having internet connection and articles being available', function () {
    const html = fs.readFileSync(
      path.join(__dirname, 'files', 'elnuevodia.html'),
      'utf8'
    );
    beforeEach(() => {
      nock(siteUrl).get('/').reply(200, html);
    });

    it('should return the leading article', async function () {
      const response = await siteParser();

      expect(response).toHaveLength(3);

      const leadingArticle = response[0];
      expect(Object.keys(leadingArticle)).toEqual(
        expect.arrayContaining(['title', 'summary', 'link', 'paywall'])
      );

      expect(leadingArticle.title).toBe(
        'Breaking: "Hacer pruebas en código dismunye los bugs"'
      );

      expect(leadingArticle.summary).toBe('Vale la pena');
      expect(leadingArticle.link).toBe(
        'https://www.elnuevodia.com/noticias/pruebas-codigo-menos-bugs'
      );
    });

    it('should return the secondary articles', async function () {
      const response = await siteParser();

      const firstSecondaryArticle = response[1];
      expect(Object.keys(firstSecondaryArticle)).toEqual(
        expect.arrayContaining(['title', 'summary', 'link', 'paywall'])
      );
      expect(firstSecondaryArticle.title).toBe(
        'El representante de la cámara de pruebas guíaba carro hurtado'
      );
      expect(firstSecondaryArticle.summary).toBe(
        `El individuo invadió el carril contrario de la PR-UEBA, ocasionando el choque de otras cinco pruebas.`
      );
      expect(firstSecondaryArticle.link).toBe(
        'https://www.elnuevodia.com/noticias/representante-guiaba-carro-robado/'
      );

      const secondSecondaryArticle = response[2];
      expect(Object.keys(secondSecondaryArticle)).toEqual(
        expect.arrayContaining(['title', 'summary', 'link', 'paywall'])
      );

      expect(secondSecondaryArticle.title).toBe(
        'Mejoran las pruebas en la capital de Pruebalandia'
      );

      expect(secondSecondaryArticle.summary).toBe(
        'La presidente de Pruebalandia se expresó'
      );
      expect(secondSecondaryArticle.link).toBe(
        'https://www.elnuevodia.com/noticias/pruebalandia-mejora/'
      );
    });
  });

  describe('paywalled articles being available', function () {
    const html = fs.readFileSync(
      path.join(__dirname, 'files', 'elnuevodia-paywall.html'),
      'utf8'
    );
    beforeEach(() => {
      nock(siteUrl).get('/').reply(200, html);
    });

    it('should not return articles which are behind a paywall', async function () {
      const response = await siteParser();

      expect(response).toHaveLength(2);
    });
  });
});
