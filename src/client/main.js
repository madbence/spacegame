import React from 'react';
import { Provider } from 'react-redux';

import Chat from './components/chat';
import store from './store';
import renderPlayground from './render';

import key from './lib/keypress';

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

function accelerate(index, state) {
  store.dispatch({
    type: 'ACCELERATE',
    payload: {
      index,
      state,
    },
  });
}

function rotate(index, dir) {
  store.dispatch({
    type: 'ROTATE',
    payload: {
      index,
      dir,
    },
  });
}

key((type, e) => {
  switch (type) {
    case 'down':
    switch (e.keyCode) {
      case 87: accelerate(0, true); break;
      case 65: rotate(0, -0.001); break;
      case 68: rotate(0, 0.001); break;
    }
    break;
    case 'up':
    switch (e.keyCode) {
      case 87: accelerate(0, false); break;
      case 65: rotate(0, 0); break;
      case 68: rotate(0, 0); break;
    }
  }
});

tick();
