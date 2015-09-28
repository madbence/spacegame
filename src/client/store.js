import WS from 'ws';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import uuid from 'uuid';

import messages from './reducers';
import ships from '../common/game';

const client = new WS('ws://localhost:3000');

function act(type, payload, meta) {
  return {
    type,
    payload,
    meta,
  };
}

const pending = new Map();

client.onmessage = event => {
  const action = JSON.parse(event.data);
  if (action.meta && pending.has(action.meta.id)) {
    pending.get(action.meta.id)(action);
  } else {
    store.dispatch(action);
  }
};

const middlewares = [
  () => next => action => {
    /* eslint-disable no-console */
    // console.log(JSON.stringify(store.getState()));
    /* eslint-enable no-console */
    return next(action);
  },
  store => next => action => {
    switch (action.type) {
      case 'ADD_MESSAGE':
      if (!action.meta || action.meta.done !== true) {
        const id = uuid.v4();
        client.send(JSON.stringify(act('ADD_MESSAGE', {
          message: action.payload.message,
        }, {
          id,
        })));
        next(act('ADD_MESSAGE', action.payload, { id }));
        return new Promise(resolve => {
          pending.set(id, resolve);
        }).then(action => {
          store.dispatch(action);
        });
      }
    }
    return next(action);
  }
];

const store = applyMiddleware(...middlewares)(createStore)(combineReducers({
  messages,
  ships,
}), {
  messages: [],
  ships: [{
    pos: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
    rot: 0,
    avel: 0,
    thrust: false,
    rotThrust: 0,
  }],
});

export default store;
