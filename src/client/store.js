import { applyMiddleware, createStore, combineReducers } from 'redux';

import messages from './reducers/chat';
import route from './reducers/navigation';
import game from '../common/game';

import websocket from './middlewares/websocket';
import initRender from './render';

const middlewares = [
  store => next => action => {
    if (action.type === 'NAVIGATE' &&
        action.payload.route === '/game') {
      next(action);
      store.dispatch({
        type: 'INIT_GAME',
        meta: {
          pending: true,
        }
      });
      return;
    }
    next(action);
  },
  websocket,
  store => next => action => {
    if (action.type === 'INIT_GAME') initRender(Date.now() - action.payload.time, store);
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
