# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- [ ] Añadir más sites

  - [x] noticel
  - [x] vocero
  - [x] primera hora
  - [ ] índice
  - [ ] etc...

- [ ] Utilizar [conf](https://github.com/sindresorhus/conf) para almacenar posibles configuraciones

### Changed

- [ ] Poder utilizar proxies y otras configuraciones relacionadas al http

- [ ] Opciones para el tamaño del font, espacio, color, etc...

- [ ] Múltiples columnas usando [columnify](https://github.com/timoxley/columnify) o similar?

### Other

- [ ] Contribuir algunos [custom parsers](https://github.com/postlight/mercury-parser/tree/master/src/extractors/custom#custom-parsers)?

## [0.13.0] - 2022-08-08
### Breaking

- Requiere `Node >= 16`

## [0.12.0] - 2022-08-08

### Breaking

- Requiere `Node >= 14`
### Updated
- Actualizar dependencias

- `noticias-pr` ahora utiliza [ES Modules](https://nodejs.org/api/esm.html#modules-ecmascript-modules)

## [0.11.0] - 2020-12-22

### Added
- Utilizar Github Actions

### Updated

- Actualizar dependencias

- Correr Prettier

### Removed

- Remover TravisCI

## [0.10.0] - 2020-02-18

### Added
- Obtener noticas de El Vocero (gracias [@agmm](https://github.com/agmm))
### Updated

- Actualizar dependencias

## [0.3.0] - 2019-06-29

### Added

- Obtener noticias de Noticel

### Updated

- Actualizar dependencias

## [0.2.2] - 2019-04-14

### Updated

- Actualizar varios módulos, incluyendo `mercury-parser`.

## [0.2.1] - 2019-03-03

### Fixed

- La falta de un shebang en `cli.js` rompió la instalación desde npm

## [0.2.0] - 2019-03-03

### Added

- Obtener noticias de Primera Hora

### Updated

- Mejoras a las pruebas y cubierta
- Varios paquetes actualizados
- Código reformateado

## [0.1.2] - 2019-02-14

### Added

- Una función `onDelete` para para que los prompts cierren sin tanto error

### Fixed

- Ahora `package.json` tiene una llave "main"

## [0.1.1] - 2019-02-13

### Added

- Versión beta
- Paquete publicado en npm
