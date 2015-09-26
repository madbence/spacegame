# spacegame [![Build Status](https://travis-ci.org/madbence/spacegame.svg)](https://travis-ci.org/madbence/spacegame)

## install

Right now, Windows is not fully supported (Flowtype has no pre-built windows binaries), everything else should work.

```sh
$ git clone ...
$ npm i
```

## run

```sh
# unix
$ npm run start:dev # automatic recompile on change, etc

# windows (has no support for sh primitives like & and wait)
$ npm run build:js
$ npm run build:css
$ npm start

# open localhost:3000 in the browser
```
## lint

```sh
$ npm run lint
```

## stack

The app server uses [`koa`](http://koajs.com/) to serve `HTTP` requests,
and [`ws`](https://www.npmjs.com/package/ws) to manage `WebSocket` connections.
The code is written in *modern* javascript, and it is compiled down to runnable
code with [`babel`](http://babeljs.io/). Client-side code is bundled using [`browserify`](http://browserify.org/) ([`watchify`](https://www.npmjs.com/package/watchify) provides incremental builds), using the [`babelify`](https://github.com/babel/babelify) tranform module. Typechecking provided by [`flowtype`](http://flowtype.org).
HTML is rendered with [`react`](https://facebook.github.io/react/), using [`redux`](http://rackt.github.io/redux/) as state container.
CSS preprocessor is [`stylus`](https://learnboost.github.io/stylus/). The codebase is linted with [`eslint`](http://eslint.org).

*TODO from here...*

The test runner is [`ava`](https://npmjs.com/ava), test coverage is created by [`istanbul`](https://gotwarlost.github.io/istanbul/) (with the help of [`isparta`](https://github.com/douglasduteil/isparta)).

## docs

- [`src/server`](src/server)
- [`src/client`](src/client)

## resources

- https://github.com/substack/browserify-handbook
- http://www.2ality.com/2014/08/es6-today.html
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
- https://github.com/tj/co
- https://github.com/lukehoban/ecmascript-asyncawait
- https://facebook.github.io/react/
- http://rackt.github.io/redux/
- http://flowtype.org/
