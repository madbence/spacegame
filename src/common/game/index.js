// @flow

import simulate from './simulate';
import {sadd, unit, distance} from './vector';
import {mkShip} from './utils';

import {SHOOT, THRUST, ADD_SHIP, ADD_PLAYER, SYNC} from './actions';
import type {Action} from './actions';

export type Vec = [number, number];

export type Thruster = {
  pos: Vec, ori: number, thrust: number,
}

export type Ship = {
  id: number,
  type: number,
  owner: number,
  pos: Vec, vel: Vec, acc: Vec,
  ori: number, rot: number, tor: number,
  health: number,
  thrusters: number[],
};

export type Projectile = {
  owner: number,
  pos: Vec, vel: Vec, ori: number, t: number,
};

export type Player = {
  name: string,
  id: number,
  score: number,
};

export type State = {
  ships: Ship[],
  projectiles: Projectile[],
  players: Player[],
  t: number,
  dt: number,
  ids: number,
};

export default class GameRunner {
  state: State;

  constructor() {
    this.state = {
      ships: [],
      projectiles: [],
      players: [],
      t: 0,
      dt: 1 / 60,
      ids: 0,
    }
  }

  handle(action: Action) {
    if (action.type !== SYNC && action.t) {
      this.simulate(action.t);
    }

    switch (action.type) {
      case SHOOT: this.shoot(action.id); break;
      case THRUST: this.thrust(action.id, action.index, action.strength); break;
      case ADD_SHIP: this.addShip(action.ship, action.owner, action.pos, action.ori); break;
      case ADD_PLAYER: this.addPlayer(action.name); break;
    }
  }

  simulate(t: number): State {
    if (this.state.t + 10 < t) {
      throw new Error('Out of sync!');
    }
    this.state = simulate(this.state, t);
    return this.state;
  }

  addShip(type: number, owner: number, pos: Vec, ori: number): number {
    const id = this.state.ids;
    this.state = {
      ...this.state,
      ids: id + 1,
      ships: [...this.state.ships, mkShip(id, type, owner, pos, ori)],
    }
    return id;
  }

  addPlayer(name: string): number {
    const id = this.state.ids;
    this.state = {
      ...this.state,
      ids: id + 1,
      players: [...this.state.players, { name, id, score: 0 }],
    };
    return id;
  }

  removePlayer() {}

  shoot(id: number) {
    const ship = this.state.ships.find(ship => ship.id === id);
    if (!ship) return;
    this.state = {
      ...this.state,
      projectiles: [...this.state.projectiles, {
        owner: ship.owner,
        pos: ship.pos,
        vel: sadd(ship.vel, unit(ship.ori), -10),
        ori: ship.ori,
        t: this.state.t,
      }],
    };
  }

  thrust(id: number, thrusterIndex: number, strength: number) {
    this.state = {
      ...this.state,
      ships: this.state.ships.map(ship => ship.id !== id ? ship : ({
        ...ship,
        thrusters: ship.thrusters.map((thruster, i) => i != thrusterIndex ? thruster : strength),
      })),
    };
  }
}
