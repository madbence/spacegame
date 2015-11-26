import simulate from '../../shared/game';
import subscribe from '../lib/keypress';
import store from '../store';

import renderScene from './scene';

import {
  length,
} from '../../shared/util/vector';

import {
  SET_THRUST,
  FIRE_WEAPON,
} from '../../shared/actions';

class GameClient {
  constructor(store, el) {
    this.ctx = el.getContext('2d');
    this.store = store;
    this.cachedState = null;
    this.lastKnownTime = null;

    const getCurrentShip = () => {
      const clientId = store.getState().client.id;
      const game = store.getState().game;
      if (!clientId || !game) {
        return null;
      }
      return game.ships.filter(ship => ship.client === clientId)[0] || null;
    };

    const dispatch = (type, payload) => {
      const currentShip = getCurrentShip();
      if (!currentShip) {
        return;
      }
      store.dispatch({
        type,
        payload: {
          ...payload,
          shipId: currentShip.id,
        },
        meta: {
          pending: true,
        },
      });
    };

    const accelerate = (thrusterIndex, strength) => () => {
      dispatch(SET_THRUST, {
        thrusterIndex,
        strength,
      });
    };

    const fire = () => {
      dispatch(FIRE_WEAPON, {});
    };

    subscribe(87, accelerate(0, 40), accelerate(0, 0));
    subscribe(65, accelerate(1, 0.1), accelerate(1, 0));
    subscribe(68, accelerate(2, 0.1), accelerate(2, 0));
    subscribe(32, fire, undefined, true);

    this.loop = this.loop.bind(this);
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
        game = this.cachedState = simulate(this.cachedState, {
          type: 'NOOP',
          payload: {
            time: Date.now() - this.offset,
          },
        });
      }
    }

    const currentShip = game && game.ships.filter(ship => ship.client === state.client.id)[0];
    const viewport = currentShip ? {
      position: currentShip.position,
      scale: Math.min(1, Math.max(0.5, 1 / (1 + length(currentShip.velocity) / 100))),
      orientation: currentShip.orientation,
      alive: true,
    } : {
      position: { x: 0, y: 0 },
      scale: 0.4,
      orientation: 0,
      alive: false,
    };

    renderScene(this.ctx, game, viewport);
  }
}

let client;
export function attach(el) {
  client = new GameClient(store, el);
  client.loop();
}

export function detach() {
  client = null;
}
