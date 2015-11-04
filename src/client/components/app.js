import React from 'react';

import Login from './login';
import Lobby from './lobby';
import Game from './game';

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
      <Login onLogin={() => navigate('/lobby')} />
    );
    case '/lobby': return (
      <Lobby onJoin={() => navigate('/game')} />
    );
    case '/game': return (
      <Game {...props} />
    );
    default: return (
      <div>
        <h1>Unknown route...</h1>
        <h3>Current state:</h3>
        <pre>{JSON.stringify(props, null, 2)}</pre>
        <button onClick={() => navigate('/login')}>Home</button>
      </div>
    );
  }
};
