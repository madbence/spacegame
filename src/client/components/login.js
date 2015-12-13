import React from 'react';

export default props => (
  <div id='login'>
    <h1>SpaceGame</h1>
    <p>Lorem impsum blah blah blah</p>
    <button onClick={props.onLogin}>Log in</button>
    <button className='signup'>Sign up</button>
  </div>
);
