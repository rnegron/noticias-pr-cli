<h1 align="center">
 noticias-pr
</h1>
<br>
<p align="center">
  <!-- badges here -->
</p>

<p align="center"><code>noticias-pr</code> es una herramienta del command-line escrita en Node.js para navegar y leer noticias locales desde la comodidad de tu terminal.</p>

- [Demo](#demo)
- [Instalación](#instalación)
- [Uso](#uso)
- [Creditos](#creditos)
- [Licensia](#licensia)

## Demo

## Instalación

Asegurate tener [Node](https://nodejs.org/en/) versión 8 en adelante.

```bash
$ npm install -g noticias-pr
```

Con la opcíon `-g`, **npm** instalará `noticias-pr` globalmente, y el comando "`noticas-pr`" estará siempre accesible.

## Uso

```bash
noticias-pr
```

Luego, seguir las instrucciones desplegadas en el terminal.

    Para navegar: usar las flechas del teclado.
    Para aceptar: Utilizar el teclado de **enter** o **return**.

### Noticieros Disponibles

En orden de añadición:

1. El Nuevo Día: https://www.elnuevodia.com

## Créditos

La applicación fue inspirada gracias a la existencia del [Mercury Parser](https://github.com/postlight/mercury-parser).

`noticas-pr` tiene las siguientes dependencias:

- [clear]() - Para limpiar el términal en determinados momentos.
- [ora]() - Para manejar los círculitos que dan vuelta mientras se espera.
- [kleur]() - Para colorizar el texto.
- [date-fns]() - Para manipular tiempo
- [mercury-parser]() - Para encontrar información de intrés en un artículo.
- [prompts]() - Para proveer interactividad en el terminal.
- [supports-color]() - Para verificar si el terminal permite desplegar colores.
- [terminal-image]() - Para desplegar imágenes en el terminal.
- [terminal-link]() - Para verificar y desplegar enlaces en el terminal.
- [update-notifier]() - Para notificar si hay versiones nuevas disponibles.
- [x-ray]() - Para navegar y descomponer páginas web y extraer su contenido.

## Licencia

[MIT](LICENSE) &copy; [Raúl Negrón](https://raulnegron.me)

<p align="center">
<br>
	<img height="100" src="https://hechoen.pr/wp-content/themes/hepr/images/logo.png
" alt="Hecho en 🇵🇷" />

</p>
