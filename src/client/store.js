import { applyMiddleware, createStore, combineReducers } from 'redux';

import messages from './reducers/chat';
import route from './reducers/navigation';
import game from '../shared/game';
import client from './reducers/client';

import websocket from './middlewares/websocket';

import { NAVIGATE } from './actions';

const middlewares = [
  websocket,
  () => next => action => {
    if (action.type === NAVIGATE && window.location.pathname !== action.payload.route) {
      window.history.pushState({}, '', action.payload.route);
    }
    return next(action);
  },
];

const store = applyMiddleware(...middlewares)(createStore)(combineReducers({
  messages,
  game,
  route,
  client,
}), window.__INITIAL_STATE__);

export default store;
