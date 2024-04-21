import fs from 'fs';
import path from 'path';
import nock from 'nock';
import { URL } from 'url';

import siteParser from '../lib/noticieros/elvocero.js';

const siteUrl = 'https://www.elvocero.com/';

const __dirname = new URL('.', import.meta.url).pathname;

describe('parsing el vocero articles', function () {
  describe('having internet connection and articles being available', function () {
    const html = fs.readFileSync(
      path.join(__dirname, 'files', 'elvocero.html'),
      'utf8'
    );
    beforeEach(() => {
      nock(siteUrl).get('/').reply(200, html);
    });

    it('should return the articles', async function () {
      const response = await siteParser();

      expect(response).toHaveLength(5);
      for (const article of response) {
        expect(Object.keys(article)).toEqual(expect.arrayContaining(['title', 'link']));
      }
      expect(response[0].title).toBe('Dr. Pruebito descubre químico para eliminar los bugs');

      expect(response[0].link).toBe('https://www.elvocero.com/noticia_rotary/01.html');

      expect(response[1].title).toBe('La ONU declara Pruebalandia como patrimonio de la humanidad');
      expect(response[1].link).toBe('https://www.elvocero.com/noticia_rotary/02.html');

      expect(response[2].title).toBe('El parlamento pruebalandino decide hacer frente a los bugs');

      expect(response[2].link).toBe('https://www.elvocero.com/noticia_rotary/03.html');

      expect(response[3].title).toBe('Breaking: "Las pruebas son tediosas, pero útiles"');
      expect(response[3].link).toBe('https://www.elvocero.com/noticia_rotary/04.html');

      expect(response[4].title).toBe('Tráfico severo en la PR-UEBA');

      expect(response[4].link).toBe('https://www.elvocero.com/noticia_rotary/05.html');
    });
  });
});
