import App from './components/app';
import { connect, Provider } from 'react-redux';
import { render } from 'react-dom';
import React from 'react';

import store from './store';
import subscribe from './lib/keypress';

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
  return function () {
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
  };
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

subscribe(87, accelerate(0, 0.02), accelerate(0, 0));
subscribe(65, accelerate(1, 0.0002), accelerate(1, 0));
subscribe(68, accelerate(2, 0.0002), accelerate(2, 0));
subscribe(32, fire, undefined, true);

window.addEventListener('popstate', () => {
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
