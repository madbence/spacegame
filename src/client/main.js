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
    time += 1000/60
  }
  renderPlayground(store);
  requestAnimationFrame(tick);
};

function accelerate(index, strength) {
  store.dispatch({
    type: 'SET_THRUSTER_STRENGTH',
    payload: {
      shipIndex: 0,
      thrusterIndex: index,
      strength: strength,
    },
  });
}

key((type, e) => {
  switch (type) {
    case 'down':
    switch (e.keyCode) {
      case 87: accelerate(0, 0.02); break;
      case 65: accelerate(1, 0.0005); break;
      case 68: accelerate(2, 0.0005); break;
    }
    break;
    case 'up':
    switch (e.keyCode) {
      case 87: accelerate(0, 0); break;
      case 65: accelerate(1, 0); break;
      case 68: accelerate(2, 0); break;
    }
  }
});

tick();
