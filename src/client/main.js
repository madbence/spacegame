import React from 'react';
import { Provider } from 'react-redux';

import Chat from './components/chat';
import store from './store';

React.render(
  <Provider store={ store }>
    { () => <Chat /> }
  </Provider>,
  document.getElementById('mount')
);
