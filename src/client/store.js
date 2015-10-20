import WS from 'ws';
import { applyMiddleware, createStore, combineReducers } from 'redux';

import messages from './reducers';
import game from '../common/game';

const client = new WS('ws://localhost:3000');

function send(type, payload, meta) {
  const message = JSON.stringify({
    type,
    payload,
    meta,
  });

  client.send(message);
}

client.onmessage = event => {
  const action = JSON.parse(event.data);
  store.dispatch(action);
};

const middlewares = [
  store => next => action => {
    if (!action.meta || !action.meta.done) {
      return send(action.type, action.payload, action.meta);
    }
    return next(action);
  }
];

const store = applyMiddleware(...middlewares)(createStore)(combineReducers({
  messages,
  game,
}), {
  messages: [],
  game: {
    ships: [{
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      orientation: Math.PI / 2,
      rotation: 0,
      thrusters: [{
        position: { x: 0, y: -10 },
        orientation: 0,
        strength: 0,
      }, {
        position: { x: 5, y: 8 },
        orientation: Math.PI / 2,
        strength: 0
      }, {
        position: { x: -5, y: 8 },
        orientation: -Math.PI / 2,
        strength: 0
      }],
    }],
    projectiles: [],
  },
});

export default store;
