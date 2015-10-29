import apply from '../../common/game';
import uuid from 'uuid';
import * as actions from '../../common/actions';

const validActions = Object.keys(actions).map(key => actions[key]);

class Game {
  constructor() {
    this.id = uuid.v4();
    this.listeners = [];
    this.players = [];
    this.offset = Date.now();
    this.state = {
      time: 0,
      step: 20,
      ships: [],
      projectiles: [],
    };
    console.log('Game %s created!', this.id);
  }

  step(action) {
    if (!validActions.includes(action.type) ||
        action.type === actions.INIT_GAME) {
      return;
    }
    try {
      action.payload.time = Date.now() - this.offset;
      this.state = apply(this.state, action);
    } catch (e) {
      //
    }
    for (const listener of this.listeners) {
      listener(action, this);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx < 0) {
        return;
      }
      this.listeners.splice(idx, 1);
      console.log('Client N/A left game %s', this.id);
      if (this.listeners.length === 0) {
        this.destroy();
      }
    };
  }

  join(client) {
    console.log('Client %s joined to game %s', client.id, this.id);
    this.step({
      type: actions.JOIN_PLAYER,
      payload: {},
    });
    this.players.push(client);
    client.subscribe(action => this.step(action));
  }

  destroy() {
    games.delete(this);
    console.log('Game %s destroyed!', this.id);
  }
}

const games = new Set();

export function create() {
  for (const game of games) {
    if (game.players.length < 4) {
      return game;
    }
  }
  const game = new Game();
  games.add(game);
  return game;
}
