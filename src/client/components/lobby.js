import React from 'react';

export default props => (
  <div id='lobby'>
    <h1>Lobby</h1>
    <p>Chat with other players, blah blah blah...</p>
    <button onClick={props.onJoin}>Join game</button>
  </div>
)
