import simulate from '../../shared/game';
import subscribe from '../lib/keypress';
import store from '../store';

import renderScene from './scene';

import {
  length,
} from '../../shared/util/vector';

import {
  setThrust,
  fireWeapon,
  noop,
} from '../../shared/actions';

function rand() {
  return Math.floor(Math.random() * 2000 - 1000);
}

class GameClient {
  constructor(store) {
    this.store = store;
    this.cachedState = null;
    this.lastKnownTime = null;
    this.decorations = [];
    this.loop = this.loop.bind(this);
    this.particles = Array(1000).fill().map(() => ({
      position: {
        x: rand(),
        y: rand(),
      },
    }));
  }

  attach(el) {
    this.ctx = el.getContext('2d');

    const getCurrentShip = () => {
      const clientId = store.getState().client.id;
      const game = store.getState().game;
      if (!clientId || !game) {
        return null;
      }
      return game.ships.filter(ship => ship.client === clientId)[0] || null;
    };

    const dispatch = (action) => {
      const currentShip = getCurrentShip();
      if (!currentShip) {
        return;
      }

      action.payload.shipId = currentShip.id;
      store.dispatch(action);
    };

    const accelerate = (thrusterIndex, strength) => () => dispatch(setThrust(thrusterIndex, strength));
    const fire = () => dispatch(fireWeapon());

    this.listeners = [
      subscribe(87, accelerate(0, 1), accelerate(0, 0)),
      subscribe(65, accelerate(1, 1), accelerate(1, 0)),
      subscribe(68, accelerate(2, 1), accelerate(2, 0)),
      subscribe(32, fire, undefined, true),
    ];
  }

  detach() {
    for (const unsubscribe of this.listeners) {
      unsubscribe();
    }
  }

  loop() {
    this.render();
    requestAnimationFrame(this.loop);
  }

  render() {
    const state = this.store.getState();
    let game = state.game;

    if (game) {
      if (!this.lastKnownTime || this.lastKnownTime < game.time) {
        this.offset = Date.now() - game.time;
        this.lastKnownTime = game.time;
        this.cachedState = game;
      } else {
        game = this.cachedState = simulate(this.cachedState, noop(Date.now() - this.offset));
      }
    }

    if (game) {
      this.decorations = this.decorations.concat(game.events);
    }

    const currentShip = game && game.ships.filter(ship => ship.client === state.client.id)[0];
    const viewport = currentShip ? {
      position: currentShip.position,
      scale: 0.8 + Math.pow(0.2, 1 + length(currentShip.velocity) / 100),
      orientation: currentShip.orientation,
      alive: true,
    } : {
      position: { x: 0, y: 0 },
      scale: 0.4,
      orientation: 0,
      alive: false,
    };

    renderScene(this.ctx, game, this.decorations, this.particles, viewport);
  }
}

let client;
export function attach(el) {
  client = new GameClient(store);
  client.attach(el);
  client.loop();
}

export function detach() {
  client.detach();
  client = null;
}
