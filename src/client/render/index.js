import simulate from '../../shared/game';
import store from '../store';

import renderScene from './scene';

import {
  length,
} from '../../shared/util/vector';

import {
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
  }

  detach() {
  }

  loop() {
    this.render();
    requestAnimationFrame(this.loop);
  }

  get currentShip() {
    const clientId = this.store.getState().client.id;
    const game = this.store.getState().game;
    if (!clientId || !game) {
      return null;
    }
    const player = game.players.filter(player => player.client === clientId)[0];
    if (!player) {
      return null;
    }
    return game.ships.filter(ship => ship.owner === player.id)[0] || null;
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

    const currentShipId = this.currentShip ? this.currentShip.id : null;
    const currentShip = currentShipId ? game.ships.filter(ship => ship.id === currentShipId)[0] : null;
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

    renderScene(this.ctx, game, this.particles, viewport);
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
