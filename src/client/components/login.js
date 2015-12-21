import React from 'react';

export default class Login extends React.Component {
  displayName: 'Login'

  _onSubmit() {
    // TODO: check input
    this.refs.form.submit();
  }

  render() {
    return (
      <form id='login' action='/auth/local' method='post' ref='form'>
        <h1>SpaceGame</h1>
        <input type='text' name='username' placeholder='Username' />
        <input type='text' name='password' placeholder='Password' />
        <button onClick={() => this._onSubmit()}>Log in</button>
        <button className='signup'>Sign up</button>
        <a href='/auth/google'>Sign in with Google</a>
        <a href='/auth/facebook'>Sign in with Facebook</a>
      </form>
    );
  }
}
