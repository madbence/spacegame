import { CLIENT_INIT } from '../../shared/actions';

import {
  CLIENT_DISCONNECT,
  CLIENT_CONNECT,
} from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case CLIENT_INIT:
      return {
        ...state,
        id: action.payload.id,
      };
    case CLIENT_DISCONNECT:
      return {
        state: 'disconnected',
        id: null,
      };
    case CLIENT_CONNECT:
      return {
        state: 'connected',
        id: null,
      };
    default:
      return state;
  }
};
