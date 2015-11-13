import App from './components/app';
import { connect, Provider } from 'react-redux';
import { render } from 'react-dom';
import React from 'react';

import store from './store';
import { bind as bindKey } from './lib/keypress';

import {
  SET_THRUST,
  FIRE_WEAPON,
} from '../common/actions';

function getCurrentShipId() {
  const state = store.getState();
  const id = state.client.id;
  if (!id) {
    return;
  }
  return store.getState().game.ships.filter(ship => ship.client === id).map(ship => ship.id)[0]
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

bindKey(87, accelerate.bind(null, 0, 0.02), accelerate.bind(null, 0, 0));
bindKey(65, accelerate.bind(null, 1, 0.0002), accelerate.bind(null, 1, 0));
bindKey(68, accelerate.bind(null, 2, 0.0002), accelerate.bind(null, 2, 0));
bindKey(32, fire, null);


const ReduxApp = connect(x => x)(App);

render(
  <Provider store={store}>
    <ReduxApp />
  </Provider>, document.getElementById('mount'));
