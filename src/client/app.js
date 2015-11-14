import App from './components/app';
import { connect, Provider } from 'react-redux';
import { render } from 'react-dom';
import React from 'react';

import store from './store';

window.addEventListener('popstate', () => {
  store.dispatch({
    type: 'NAVIGATE',
    payload: {
      route: window.location.pathname,
    },
  });
});

const ReduxApp = connect(x => x)(App);

render(
  <Provider store={store}>
    <ReduxApp />
  </Provider>, document.getElementById('mount'));
