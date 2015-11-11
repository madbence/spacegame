import App from './components/app';
import { connect, Provider } from 'react-redux';
import { render } from 'react-dom';
import React from 'react';

import store from './store';
import key from './lib/keypress';

import {
  SET_THRUST,
  FIRE_WEAPON,
} from '../common/actions';

function getCurrentShipId() {
  const state = store.getState();
  const id = state.client.id;
  if (!id || !state.game) {
    return;
  }
  return store.getState().game.ships.filter(ship => ship.client === id).map(ship => ship.id)[0];
}

function accelerate(index, strength) {
  const shipId = getCurrentShipId();
  if (!shipId) {
    return;
  }
  store.dispatch({
    type: SET_THRUST,
    payload: {
      thrusterIndex: index,
      strength: strength,
      shipId,
    },
    meta: {
      pending: true,
    },
  });
}

function fire() {
  const shipId = getCurrentShipId();
  if (!shipId) {
    return;
  }
  store.dispatch({
    type: FIRE_WEAPON,
    payload: {
      shipId,
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
      case 65: accelerate(1, 0.0002); break;
      case 68: accelerate(2, 0.0002); break;
      case 32: fire(); e.preventDefault(); break;
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

window.addEventListener('popstate', (event) => {
  store.dispatch({
    type: 'NAVIGATE',
    payload: {
      route: window.location.pathname,
    },
  });
});

const ReduxApp = connect(x => x)(App);

render(
  <Provider store={store}>
    <ReduxApp />
  </Provider>, document.getElementById('mount'));
