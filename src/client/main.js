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

let time = Date.now();
const tick = () => {
  const now = Date.now();
  while (time + 1000/60 < now) {
    store.dispatch({ type: 'TICK' });
    time += 1000/60
  }
  render();
  requestAnimationFrame(tick);
};

const ctx = document.getElementById('canvas').getContext('2d');
function render() {
  const state = store.getState();
  ctx.save();
  ctx.clearRect(0, 0, 500, 500);
  ctx.translate(250.5, 250.5);
  for (const ship of state.ships) {
    ctx.translate(ship.pos.x, ship.pos.y);
    ctx.rotate(ship.rot);
    ctx.fillRect(-5, -10, 10, 20);
    if (ship.thrust) {
      ctx.save();
      ctx.fillStyle = 'red';
      ctx.fillRect(-2.5, -20, 5, 10);
      ctx.restore();
    }
    if (ship.rotThrust < 0) {
      ctx.save();
      ctx.fillStyle = 'red';
      ctx.fillRect(2.5, -7.5, 5, 5);
      ctx.fillRect(-7.5, 2.5, 5, 5);
      ctx.restore();
    }
    if (ship.rotThrust > 0) {
      ctx.save();
      ctx.fillStyle = 'red';
      ctx.fillRect(-7.5, -7.5, 5, 5);
      ctx.fillRect(2.5, 2.5, 5, 5);
      ctx.restore();
    }
  }
  ctx.restore();
}

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
