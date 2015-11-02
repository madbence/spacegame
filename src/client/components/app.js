import React from 'react';

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
      <div>
        <h1>Hello! Please log in or register!</h1>
        <button onClick={() => navigate('/lobby')}>Login</button>
      </div>
    );
    case '/lobby': return (
      <div>
        <h1>Lobby</h1>
        <h3>You can chat with other player while you wait</h3>
        <button onClick={() => navigate('/game')}>Join game!</button>
      </div>
    );
    case '/game': return (
      <div>
        <h1>Game {JSON.stringify(props.client)}</h1>
        <canvas id='canvas' width='500' height='500'>Canvas not supported by your browser!</canvas>
      </div>
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
