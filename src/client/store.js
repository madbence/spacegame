import { applyMiddleware, createStore, combineReducers } from 'redux';

import messages from './reducers/chat';
import route from './reducers/navigation';
import game from '../common/game';
import client from './reducers/client';

import websocket from './middlewares/websocket';
import initRender from './render';

import {
  SYNC_GAME,
} from '../common/actions';

const middlewares = [
  websocket,
  store => next => action => {
    if (action.type === 'NAVIGATE' && window.location.pathname !== action.payload.route) {
      window.history.pushState({}, '', action.payload.route);
    }
    return next(action);
  },
  store => next => action => {
    if (action.type === SYNC_GAME) {
      initRender(Date.now() - action.payload.time, store);
    }
    return next(action);
  }
];

const store = applyMiddleware(...middlewares)(createStore)(combineReducers({
  messages,
  game,
  route,
  client,
}), {
  route: '/login',
  messages: [],
  game: null,
  client: {
    state: 'disconnected',
    id: null,
  }
});

export default store;
