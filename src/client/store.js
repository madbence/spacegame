import WS from 'ws';
import { applyMiddleware, createStore } from 'redux';
import uuid from 'uuid';

import reducer from './reducers';
import store from './store';

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
    console.log(action);
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

export default applyMiddleware(...middlewares)(createStore)(reducer, {
  messages: [],
});
