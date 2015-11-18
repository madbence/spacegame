import React from 'react';

let auth;

gapi.load('auth2', () => {
  gapi.auth2.init({
    client_id: '657677068615-gi549u3m2i94c0h10pq5dips2qqjbnlm.apps.googleusercontent.com',
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
