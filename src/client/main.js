import React from 'react';
import Chat from 'client/components/chat';
import { Provider } from 'react-redux'
import store from 'client/store';

React.render(
  <Provider store={store}>
    {() => <Chat />}
  </Provider>,
  document.getElementById('mount')
);
