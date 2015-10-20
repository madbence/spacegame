import apply from '../../common/game';
import uuid from 'uuid';

const DELTA = 1000 / 60;

class Game {
  constructor() {
    this.id = uuid.v4();
    this.listeners = [];
    this.players = [];
    this.state = {
      ships: [{
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        orientation: Math.PI / 2,
        rotation: 0,
        thrusters: [{
          position: { x: 0, y: -10 },
          orientation: 0,
          strength: 0,
        }, {
          position: { x: 5, y: 8 },
          orientation: Math.PI / 2,
          strength: 0
        }, {
          position: { x: -5, y: 8 },
          orientation: -Math.PI / 2,
          strength: 0
        }],
      }],
      projectiles: [],
    };
    console.log('Game %s created!', this.id);
  }

  step(action) {
    try {
      this.state = apply(this.state, action);
    } catch (e) {
      //
    }
    for (const listener of this.listeners) {
      listener(action, this);
    }
  }

  tick() {
    this.step({ type: 'TICK' });
  }

  start() {
    this._start = this._current = Date.now();
    this._timer = setInterval(() => {
      const current = Date.now();
      while (this._current + DELTA  < current) {
        this._current += DELTA;
        this.tick();
      }
    }, DELTA);
  }

  stop() {
    clearTimeout(this._timer);
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
    this.players.push(client);
    console.log('Client %s joined to game %s', client.id, this.id);
    client.subscribe(action => this.step(action));
    client.join(this);
  }

  destroy() {
    this.stop();
    games.delete(this);
    console.log('Game %s destroyed!', this.id);
  }
}

const games = new Set();

export function join(client) {
  for (const game of games) {
    if (game.players.length < 4) {
      game.join(client);
      return game;
    }
  }
  const game = new Game();
  game.join(client);
  games.add(game);
  game.start();
  return game;
}
