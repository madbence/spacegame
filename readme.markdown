# spacegame [![Build Status](https://travis-ci.org/madbence/spacegame.svg)](https://travis-ci.org/madbence/spacegame)

## install

Right now, Windows is not fully supported (Flowtype has no pre-built windows binaries), everything else should work.

```sh
$ git clone ...
$ npm i
```

## run

Starting development server on port `3000`:

### unix

```sh
$ npm run watch     # automatic recompile on change, etc
```

### windows

```sh
$ npm run build:js  # build js files
$ npm run build:css # build css
$ npm start         # start dev server
```
## lint

Lint code style with [ESLint](http://eslint.org):

```sh
$ npm run lint
```

## check

Run static typechecker ([Flowtype](http://flowtype.org)):

```sh
$ npm run check
```

## stack

- [`koa`](http://koajs.com/) to serve `HTTP` requests
- [`ws`](https://www.npmjs.com/package/ws) to manage `WebSocket` connections
- [`babel`](http://babeljs.io/) for compiling down to ES5
- [`browserify`](http://browserify.org/) for bundling browser code
- [`watchify`](https://www.npmjs.com/package/watchify) for incremental builds
- [`flowtype`](http://flowtype.org) for static type analysis
- [`react`](https://facebook.github.io/react/) for rendering ui
- [`redux`](http://rackt.github.io/redux/) as state container
- [`stylus`](https://learnboost.github.io/stylus/) as CSS preprocessor
- [`eslint`](http://eslint.org) for linting the codebase
- [`ava`](https://npmjs.com/ava) used as test runner
- [`istanbul`](https://gotwarlost.github.io/istanbul/) for reporing test coverage (with the help of [`isparta`](https://github.com/douglasduteil/isparta))
- [`nodemon`](http://nodemon.io/) for app reloading

## license

MIT
