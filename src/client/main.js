import React from 'react';
import { Provider } from 'react-redux';

import Chat from './components/chat';
import store from './store';
import renderPlayground from './render';

React.render(
  <Provider store={ store }>
    { () => <Chat /> }
  </Provider>,
  document.getElementById('mount')
);

let time = Date.now();
const tick = () => {
  const now = Date.now();
  while (time + 1000/60 < now) {
    store.dispatch({ type: 'TICK' });
    time += 1000/60
  }
  renderPlayground(store);
  requestAnimationFrame(tick);
};

document.addEventListener('keydown', e => {
  switch (e.keyCode) {
    case 87:
    store.dispatch({
      type: 'ACCELERATE',
      index: 0,
      state: true,
    }); break;
    case 65:
    store.dispatch({
      type: 'ROTATE',
      index: 0,
      dir: -0.001,
    }); break;
    case 68:
    store.dispatch({
      type: 'ROTATE',
      index: 0,
      dir: 0.001,
    }); break;
  }
});

document.addEventListener('keyup', e => {
  switch (e.keyCode) {
    case 87:
    store.dispatch({
      type: 'ACCELERATE',
      index: 0,
      state: false,
    }); break;
    case 65:
    case 68:
    store.dispatch({
      type: 'ROTATE',
      index: 0,
      dir: 0,
    }); break;
  }
});

tick();
