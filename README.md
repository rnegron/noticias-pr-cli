<h1 align="center">
 noticias-pr
</h1>
<br>
<p align="center">

[![Build Status](https://travis-ci.org/rnegron/noticias-pr-cli.svg?branch=master)](https://travis-ci.org/rnegron/noticias-pr-cli)
[![Coverage Status](https://coveralls.io/repos/github/rnegron/noticias-pr-cli/badge.svg?branch=master)](https://coveralls.io/github/rnegron/noticias-pr-cli?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/d8700b46efaa7e08a8f1/maintainability)](https://codeclimate.com/github/rnegron/noticias-pr-cli/maintainability)
[![npm](https://img.shields.io/npm/v/noticias-pr.svg)](https://www.npmjs.com/package/noticias-pr)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

</p>

<p align="center" width><code>noticias-pr</code> es una herramienta del command-line escrita en Node.js para navegar y leer noticias locales desde la comodidad de tu terminal.</p>

Esta aplicación fue creada con la intención de practicar NodeJS y para aprender como publicar un paquete en [npm](https://www.npmjs.com/package/noticias-pr).

- [Demo](#demo)
- [Instalación](#instalación)
- [Uso](#uso)
- [Créditos](#créditos)
- [Legal](#legal)
- [Licencia](#licencia)

## Demo

<p align="center"><img src="/img/cli-demo.gif" style="width: 25%; height: 25%"/></p>

## Instalación

Asegurate tener [NodeJS](https://nodejs.org/en/) versión 8 en adelante.

```bash
$ npm install -g noticias-pr
```

Con la opción `-g`, **npm** instalará `noticias-pr` globalmente, y el comando "`noticas-pr`" estará siempre accesible.

## Uso

Correr el siguiente comando en el terminal:

```bash
$ noticias-pr
```

Luego, seguir las instrucciones desplegadas en el terminal.

    Para navegar: Utilizar las flechas del teclado.
    Para aceptar: Utilizar la tecla de "enter" o "return".

**Nota**: Si ocurre que al navegar entre las opciones comienzan a aparecer líneas nuevas, incrementar el ancho del terminal usualmente arregla el problema. Es un bug que estoy buscando resolver.

### Noticieros Disponibles

En orden de añadición:

1. El Nuevo Día: https://www.elnuevodia.com
2. Primera Hora: https://www.primerahora.com

## Créditos

La applicación fue inspirada gracias a la existencia del [Mercury Parser](https://github.com/postlight/mercury-parser).

`noticas-pr` tiene las siguientes dependencias:

- [ansi-escapes](https://github.com/sindresorhus/ansi-escapes) - Para utilizar varias funcionalidades en el terminal, tal y como limpiar la pantalla.
- [cfonts](https://github.com/dominikwilkowski/cfonts) - Para presentar un título gráfico al comenzar la applicación.
- [date-fns](https://github.com/date-fns/date-fns) - Para manipular el formato del tiempo.
- [html2plaintext](https://github.com/kurttheviking/html2plaintext) - Para convertir texto formateado en HTML a texto regular para depliegue en el terminal.
- [is-reachable](https://github.com/sindresorhus/is-reachable) - Para confirmar que la página web seleccionada está accesible a través del internet.
- [mercury-parser](https://github.com/postlight/mercury-parser) - Para encontrar información de intrés en un artículo.
- [ora](https://github.com/sindresorhus/ora) - Para manejar los círculitos que dan vuelta mientras se espera.
- [prompts](https://github.com/terkelg/prompts) - Para proveer interactividad en el terminal.
- [terminal-image](https://github.com/sindresorhus/terminal-image) - Para desplegar imágenes en el terminal.
- [terminal-link](https://github.com/sindresorhus/terminal-link) - Para verificar y desplegar enlaces en el terminal.
- [x-ray](https://github.com/matthewmueller/x-ray) - Para navegar y descomponer páginas web y extraer su contenido.

## Legal

Qué se yo, contáctame y resolvemos sin problema.

## Licencia

[MIT](LICENSE) &copy; [Raúl Negrón](https://raulnegron.me)

<p align="center">
<br>
	<img height="100" src="/img/pr.png" alt="Hecho en 🇵🇷" />
</p>
