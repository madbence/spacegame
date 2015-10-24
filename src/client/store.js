import WS from 'ws';
import { applyMiddleware, createStore, combineReducers } from 'redux';

import messages from './reducers/chat';
import route from './reducers/navigation';
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
    if (action.type === 'NAVIGATE' &&
        action.payload.route === '/game') {
      next(action);
      store.dispatch({
        type: 'INIT_GAME',
      });
      return;
    }
    next(action);
  },
  store => next => action => {
    if (action.meta && action.meta.pending) {
      return send(action.type, action.payload, action.meta);
    }
    return next(action);
  }
];

const store = applyMiddleware(...middlewares)(createStore)(combineReducers({
  messages,
  game,
  route,
}), {
  route: '/login',
  messages: [],
  game: null,
});

export default store;
