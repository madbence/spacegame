import React from 'react';

import Login from './login';
import Lobby from './lobby';
import Game from './game';
import Placeholder from './placeholder';

import {
  navigate,
  connectSocket,
} from '../actions';
import { joinGame } from '../../shared/actions';

export default (props) => {
  switch (props.route) {
    case '/':
    case '/login': return (
      <Login
        onLogin={() => props.dispatch(navigate('/lobby'))}
        onSignup={() => props.dispatch(navigate('/signup'))}
      />
    );
    case '/lobby': return (
      <Lobby
        onLoad={() => props.dispatch(connectSocket())}
        onJoin={(name) => {
          props.dispatch(navigate('/game'));
          props.dispatch(joinGame(name));
        }}
      />
    );
    case '/game': return (
      <Game {...props} />
    );
    default: return (
      <Placeholder />
    );
  }
};
