# spacegame [![Build Status][travis-badge]][travis-repo] [![Join the chat at https://gitter.im/madbence/spacegame][gitter-badge]][gitter-room]

## install

Right now, Windows is not fully supported (Flowtype has no pre-built windows binaries), everything else should work.

```sh
$ git clone git@github.com:madbence/spacegame.git
# or https://github.com/madbence/spacegame.git
$ npm i
```

Copy `.env.example` to `.env` to use the default development config.

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

Lint code style with [ESLint][eslint]:

```sh
$ npm run lint
```

## check

Run static typechecker ([Flowtype][flowtype]):

```sh
$ npm run check
```

## stack

- [`koa`][koa] to serve `HTTP` requests
- [`ws`][ws] to manage `WebSocket` connections
- [`babel`][babel] for compiling down to ES5
- [`browserify`][browserify] for bundling browser code
- [`watchify`][watchify] for incremental builds
- [`flowtype`][flowtype] for static type analysis
- [`react`][react] for rendering ui
- [`redux`][redux] as state container
- [`stylus`][stylus] as CSS preprocessor
- [`eslint`][eslint] for linting the codebase
- [`tape`][tape] used as test runner
- [`istanbul`][istanbul] for reporing test coverage (with the help of [`isparta`][isparta])
- [`nodemon`][nodemon] for app reloading

## license

MIT

[koa]: http://koajs.com
[ws]: https://npmjs.com/ws
[babel]: https://babeljs.io
[browserify]: http://browserify.org
[watchify]: https://npmjs.com/watchify
[flowtype]: http://flowtype.org
[react]: https://facebook.github.io/react
[redux]: http://rackt.github.io/redux/
[stylus]: https://learnboost.github.io/stylus/
[eslint]: http://eslint.org
[tape]: https://npmjs.com/tape
[istanbul]: https://gotwarlost.github.io/istanbul
[isparta]: https://github.com/douglasduteil/isparta
[nodemon]: http://nodemon.io
[travis-badge]: https://travis-ci.org/madbence/spacegame.svg
[travis-repo]: https://travis-ci.org/madbence/spacegame
[gitter-badge]: https://badges.gitter.im/madbence/spacegame.svg
[gitter-room]: https://gitter.im/madbence/spacegame
