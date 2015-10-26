import apply from '../../common/game';
import uuid from 'uuid';

class Game {
  constructor() {
    this.id = uuid.v4();
    this.listeners = [];
    this.players = [];
    this.offset = Date.now();
    this.state = {
      time: 0,
      step: 20,
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
    if (!['SET_THRUSTER_STRENGTH', 'JOIN_PLAYER'].includes(action.type)) {
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
    this.players.push(client);
    console.log('Client %s joined to game %s', client.id, this.id);
    this.step({
      type: 'JOIN_PLAYER',
      payload: {},
    });
    client.subscribe(action => this.step(action));
    client.join(this);
  }

  destroy() {
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
  return game;
}
