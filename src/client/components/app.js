import React from 'react';

import Login from './login';
import Lobby from './lobby';
import Game from './game';
import Placeholder from './placeholder';

export default (props) => {
  function navigate(route) {
    props.dispatch({
      type: 'NAVIGATE',
      payload: {
        route,
      },
    });
  }

  switch (props.route) {
    case '/login': return (
      <Login onLogin={() => navigate('/lobby')} onSignup={() => navigate('/signup')} />
    );
    case '/lobby': return (
      <Lobby onJoin={(name) => {
        navigate('/game');
        props.dispatch({
          type: 'join-game',
          payload: {
            name,
          },
          meta: {
            pending: true,
          },
        });
      }} />
    );
    case '/game': return (
      <Game {...props} />
    );
    case '/signup': return (
      <Placeholder image='signup' />
    );
    default: return (
      <Placeholder />
    );
  }
};
