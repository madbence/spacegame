import simulate from '../shared/game';
import subscribe from './lib/keypress';

import {
  length,
} from '../shared/util/vector';

import {
  SET_THRUST,
  FIRE_WEAPON,
} from '../shared/actions';

export default function render(offset, store) {
  function getCurrentShipId() {
    const state = store.getState();
    const id = state.client.id;
    if (!id || !state.game) {
      return;
    }
    return store.getState().game.ships.filter(ship => ship.client === id).map(ship => ship.id)[0];
  }

  function accelerate(index, strength) {
    return function () {
      const shipId = getCurrentShipId();
      if (!shipId) {
        return;
      }
      store.dispatch({
        type: SET_THRUST,
        payload: {
          thrusterIndex: index,
          strength: strength,
          shipId,
        },
        meta: {
          pending: true,
        },
      });
    };
  }

  function fire() {
    const shipId = getCurrentShipId();
    if (!shipId) {
      return;
    }
    store.dispatch({
      type: FIRE_WEAPON,
      payload: {
        shipId,
      },
      meta: {
        pending: true,
      },
    });
  }

  subscribe(87, accelerate(0, 0.02), accelerate(0, 0));
  subscribe(65, accelerate(1, 0.0001), accelerate(1, 0));
  subscribe(68, accelerate(2, 0.0001), accelerate(2, 0));
  subscribe(32, fire, undefined, true);

  const ctx = document.getElementById('canvas').getContext('2d');
  console.log('Game started at %s', new Date(offset));

  let lastTime;
  let localState;

  function render() {
    const state = store.getState();
    let game = state.game;
    if (!game) {
      return;
    }

    if (game.time !== lastTime || lastTime === undefined) {
      localState = game;
      lastTime = game.time;
    }

    game = localState = simulate(localState, {
      type: 'NOOP',
      payload: {
        time: Date.now() - offset,
      },
    });

    ctx.save();
    ctx.clearRect(0, 0, 1000, 500);
    ctx.translate(500.5, 250.5);
    ctx.scale(1, -1);

    const currentShip = game.ships.filter(ship => ship.client === state.client.id)[0];
    const viewport = currentShip ? {
      position: currentShip.position,
      scale: Math.min(1, Math.max(0.5, 1 / (1 + length(currentShip.velocity) / 10))),
      orientation: currentShip.orientation,
    } : {
      position: { x: 0, y: 0 },
      scale: 0.4,
      orientation: 0,
    };
    ctx.rotate(-viewport.orientation);
    ctx.scale(viewport.scale, viewport.scale);
    ctx.translate(-viewport.position.x, -viewport.position.y);

    ctx.save();
    ctx.strokeStyle = 'gray';
    ctx.beginPath();
    for (let x = -500; x <= 500; x += 20) {
      ctx.moveTo(x, -500);
      ctx.lineTo(x, 500);
    }
    for (let y = -500; y <= 500; y += 20) {
      ctx.moveTo(-500, y);
      ctx.lineTo(500, y);
    }
    ctx.stroke();
    ctx.restore();

    // for each ship
    for (const ship of game.ships) {
      // draw hull
      ctx.save();
      ctx.translate(ship.position.x, ship.position.y);
      ctx.save();
      ctx.rotate(viewport.orientation);
        ctx.save();
        ctx.fillStyle = 'green';
        ctx.fillRect(-20, 20, ship.hull * 0.4, 3);
        ctx.fillStyle = 'red';
        ctx.fillRect(-20 + ship.hull * 0.4, 20, (100 - ship.hull) * 0.4, 3);
        ctx.restore();
        ctx.save();
        ctx.rotate(Math.PI);
        ctx.scale(-1, 1);
        ctx.fillText(ship.name, -20, -25);
        ctx.restore();
      ctx.restore();
      ctx.rotate(ship.orientation);
      ctx.fillRect(-5, -10, 10, 20);
      ctx.beginPath();
      ctx.moveTo(-5, -10);
      ctx.lineTo(-5, 10);
      ctx.lineTo(0, 15);
      ctx.lineTo(5, 10);
      ctx.lineTo(5, -10);
      ctx.fill();
      for (const thruster of ship.thrusters) {
        if (thruster.strength === 0) {
          continue;
        }
        ctx.save();
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.translate(thruster.position.x, thruster.position.y);
        ctx.rotate(thruster.orientation);
        ctx.fillRect(-2, 0, 4, Math.log(20000 * thruster.strength) * -2);
        ctx.restore();
      }
      ctx.restore();
    }

    for (const projectile of game.projectiles) {
      ctx.save();
      ctx.translate(projectile.position.x, projectile.position.y);
      ctx.rotate(projectile.orientation);
      ctx.fillStyle = 'rgba(0, 128, 0, 0.5)';
      ctx.fillRect(-2.5, -5, 5, 10);
      ctx.restore();
    }
    if (!currentShip) {
      ctx.save();
      ctx.font = '72px Helvetica, sans-serif';
      ctx.textAlign = 'center';
      ctx.baseLine = 'middle';
      ctx.scale(1, -1);
      ctx.fillText('You\'re dead!  ͡° ͜ʖ ͡°', 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }

  function tick() {
    render();
    requestAnimationFrame(tick);
  }

  tick();
}
