import { applyMiddleware, createStore, combineReducers } from 'redux';

import messages from './reducers/chat';
import route from './reducers/navigation';
import game from '../common/game';

import websocket from './middlewares/websocket';

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
  websocket,
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
