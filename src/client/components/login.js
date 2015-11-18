/* global gapi */
import React from 'react';
import config from '../config';

let auth;

gapi.load('auth2', () => {
  gapi.auth2.init({
    /* eslint-disable camelcase */
    client_id: config.google.clientId,
    /* eslint-enable camelcase */
  });
  auth = gapi.auth2.getAuthInstance();
});

export default props => (
  <div id='login'>
    <h1>SpaceGame</h1>
    <p>Lorem impsum blah blah blah</p>
    <button onClick={props.onLogin}>Log in</button>
    <button onClick={props.onSignup}>Sign up</button>
    <button onClick={async () => {
      const user = await auth.signIn();
      console.log(user.getBasicProfile().getEmail());
      props.onLogin();
    }}>Log in with Google+</button>
  </div>
);
