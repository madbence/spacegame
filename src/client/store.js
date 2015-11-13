import { applyMiddleware, createStore, combineReducers } from 'redux';

import messages from './reducers/chat';
import route from './reducers/navigation';
import game from '../common/game';
import client from './reducers/client';
import site from './reducers/site';

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
    client,
    site,
}), {
    route: '/login',
    messages: [],
    game: null,
    client: {
        state: 'disconnected',
        id: null,
    },
    site: {
        session: {
            id: '',
            valid: false,
            until: 0
        },
        login: {
            errors: [],
            session_id: ''
        },
        user: {
            name: '',
            email: '',
            photo: ''
        },
        busy: false
    }
});

export default store;
