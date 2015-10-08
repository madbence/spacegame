import WS from 'ws';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import uuid from 'uuid';

import messages from './reducers';
import ships from '../common/game';

const client = new WS('ws://localhost:3000');

function send(type, payload, meta) {
  const message = JSON.stringify({
    type,
    payload,
    meta,
  });

  client.send(message);
}

const pending = new Map();

client.onmessage = event => {
  const action = JSON.parse(event.data);
  store.dispatch(action);
};

const middlewares = [
  store => next => action => {
    switch (action.type) {
      case 'ADD_MESSAGE':
      if (!action.meta || action.meta.done !== true) {
        const id = uuid.v4();
        send('ADD_MESSAGE', {
          message: action.payload.message,
        }, {
          id,
        });
        return next({
          type: 'ADD_MESSAGE',
          payload: action.payload,
          meta: { id }
        });
      }
    }
    if (!action.meta || !action.meta.done) {
      return send(action.type, action.payload, action.meta);
    }
    if (action.type != 'TICK')
    return next(action);
  }
];

const store = applyMiddleware(...middlewares)(createStore)(combineReducers({
  messages,
  ships,
}), {
  messages: [],
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
});

export default store;
