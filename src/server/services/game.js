import apply from '../../shared/game';
import uuid from 'uuid';
import {
  validGameActions as validActions,
  joinPlayer,
  heartbeat,
} from '../../shared/actions';

class Game {
  constructor() {
    this.id = uuid.v4();
    this.listeners = [];
    this.players = [];
    this.offset = Date.now();
    this.state = {
      time: 0,
      step: 20,
      uid: 1,
      ships: [],
      projectiles: [],
    };
    console.log('Game %s created!', this.id);
    this.heartbeat = setInterval(this.step.bind(this), 5000, heartbeat());
  }

  step(action) {
    if (!validActions.includes(action.type)) {
      return;
    }
    if (!this.allowed(action)) {
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

  allowed(action) {
    if (!action.meta || !action.meta.client) {
      return true;
    }
    const ship = this.state.ships.filter(ship => ship.client === action.meta.client)[0];
    if (!ship || ship.id !== action.payload.shipId) {
      return false;
    }
    return true;
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

  join(client, name) {
    console.log('Client %s joined to game %s', client.id, this.id);
    this.step(joinPlayer(client.id, name));
    this.players.push(client);
    client.subscribe(action => this.step(action));
  }

  destroy() {
    games.splice(games.indexOf(this), 1);
    clearInterval(this.heartbeat);
    console.log('Game %s destroyed!', this.id);
  }

  toJSON() {
    return {
      id: this.id,
      state: this.state,
    };
  }
}

const games = [];

export function create() {
  for (const game of games) {
    if (game.players.length < 4) {
      return game;
    }
  }
  const game = new Game();
  games.push(game);
  return game;
}

export function list() {
  return games;
}
