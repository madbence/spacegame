# client docs

## main

`main.js` contains the bootstrap logics to start the app (`redux` setup).

## store

The `store` (in `store.js`) represents the application state.

## reducers

A `reducer` is just a simple function that returns the new application state,
based on the current state, and the `action` that happened.
It's a simple `(state, action) -> state` function.

## componens

Various components live here, they are *dumb* (stateless), only the top-level
container (`Chat`) is aware of `redux` (this component is responsible for
dispatching `actions`).
