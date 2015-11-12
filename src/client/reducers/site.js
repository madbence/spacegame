/**
 * Created by Gabor on 2015.11.12..
 */

import { combineReducers } from 'redux';
import * as actions from '../actions/index';

const initialState = {
    session: {
        id: '',
        valid: false,
        until: 0
    },
    login: {
        busy: false,
        errors: [],
        session_id: ''
    },
    user: {
        name: '',
        email: '',
        photo: ''
    }
};

function session(state = initialState.session, action) {
    return state;
}

function login(state = initialState.login, action) {
    const newstate = {...state};
    switch (action.type) {
        case actions.SITE_LOGIN_MESSAGE_CLEAR:
            newstate.errors = [];
            break;
        case actions.SITE_LOGIN_MESSAGE_SET:
            newstate.errors = [];
        case actions.SITE_LOGIN_MESSAGE_ADD:
            newstate.errors = newstate.errors.concat(...action.messages);
            break;
    }
    return newstate;
}

function user(state = initialState.user, action) {
    return state;
}

const reducers = combineReducers({session, login, user});

export default reducers;
