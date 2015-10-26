import App from './components/app';
import { connect, Provider } from 'react-redux';
import { render } from 'react-dom';
import React from 'react';

import store from './store';
import key from './lib/keypress';

function accelerate(index, strength) {
  store.dispatch({
    type: 'SET_THRUSTER_STRENGTH',
    payload: {
      shipIndex: 0,
      thrusterIndex: index,
      strength: strength,
    },
    meta: {
      pending: true,
    },
  });
}

function fire() {
  store.dispatch({
    type: 'FIRE',
    payload: {
      shipIndex: 0,
    },
    meta: {
      pending: true,
    },
  });
}

key((type, e) => {
  switch (type) {
    case 'down':
    switch (e.keyCode) {
      case 87: accelerate(0, 0.02); break;
      case 65: accelerate(1, 0.0005); break;
      case 68: accelerate(2, 0.0005); break;
      case 32: fire(); break;
    }
    break;
    case 'up':
    switch (e.keyCode) {
      case 87: accelerate(0, 0); break;
      case 65: accelerate(1, 0); break;
      case 68: accelerate(2, 0); break;
    }
  }
});

const ReduxApp = connect(x => x)(App);

render(
  <Provider store={store}>
    <ReduxApp />
  </Provider>, document.getElementById('mount'));
