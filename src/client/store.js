import { applyMiddleware, createStore, combineReducers } from 'redux';

import messages from './reducers/chat';
import route from './reducers/navigation';
import game from '../common/game';

import websocket from './middlewares/websocket';
import initRender from './render';

import {
  SYNC_GAME,
} from '../common/actions';

const middlewares = [
  websocket,
  store => next => action => {
    if (action.type === SYNC_GAME) initRender(Date.now() - action.payload.time, store);
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
