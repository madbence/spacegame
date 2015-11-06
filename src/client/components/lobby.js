import React from 'react';

export default class Lobby extends React.Component {
  displayName: 'Lobby'
  render() {
    const { onJoin } = this.props;
    return (
      <div id='lobby'>
        <h1>Lobby</h1>
        <p>Chat with other players, blah blah blah...</p>
        <input type='text' ref='name' placeholder='name' />
        <button onClick={() => onJoin(this.refs.name.value)}>Join game</button>
      </div>
    );
  }
}
