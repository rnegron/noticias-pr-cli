import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import nock from 'nock';

import siteParser from '../lib/noticieros/primerahora.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrl = 'https://www.primerahora.com/noticias/';

describe('parsing primera hora articles', function () {
  describe('having internet connection and articles being available', function () {
    const html = fs.readFileSync(
      path.join(__dirname, 'files', 'primerahora.html'),
      'utf8'
    );
    beforeEach(() => {
      nock(siteUrl).get('/').reply(200, html);
    });

    it('should return the articles', async function () {
      const response = await siteParser();

      expect(response).toHaveLength(3);
      for (const article of response) {
        expect(Object.keys(article)).toEqual(expect.arrayContaining(['title', 'link']));
      }
      expect(response[0].title).toBe(
        'Breaking: "Hacer pruebas en código dismunye los bugs"'
      );
      expect(response[0].link).toBe(
        'https://www.primerahora.com/noticias/pruebas-codigo-menos-bugs/'
      );
      expect(response[1].title).toBe(
        'El representante de la cámara de pruebas guíaba carro hurtado'
      );
      expect(response[1].link).toBe(
        'https://www.primerahora.com/noticias/representante-guiaba-carro-robado/'
      );

      expect(response[2].title).toBe(
        'Mejoran las pruebas en la capital de Pruebalandia'
      );
      expect(response[2].link).toBe(
        'https://www.primerahora.com/noticias/pruebalandia-mejora/'
      );
    });
  });
});
