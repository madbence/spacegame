// @flow

import {updateShip, updateProjectile} from './update';
import {sadd, unit, distance} from './vector';
import {collision, mkShip} from './utils';

import {SHOOT, THRUST, ADD_SHIP, ADD_PLAYER} from './actions';
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
    switch (action.type) {
      case SHOOT: this.shoot(action.payload.id); break;
      case THRUST: this.thrust(action.payload.id, action.payload.index, action.payload.strength); break;
      case ADD_SHIP: this.addShip(action.payload.type, action.payload.owner, action.payload.pos, action.payload.ori); break;
      case ADD_PLAYER: this.addPlayer(action.payload.name); break;
    }
  }

  simulate(t: number): State {
    if (this.state.t + 10 < t) {
      throw new Error('Out of sync!');
    }
    while (this.state.t + this.state.dt < t) {
      this.state = {
        ...this.state,
        t: this.state.t + this.state.dt,
        ships: this.state.ships.map(ship => updateShip(ship, this.state.dt)),
        projectiles: this.state.projectiles
          .filter(projectile => projectile.t + 5 > this.state.t)
          .map(projectile => updateProjectile(projectile, this.state.dt)),
      };

      const shipDmg = this.state.ships.map(ship => this.state.projectiles.reduce((dmg, proj) => dmg + collision(ship, proj) ? .1 : 0, 0));

      this.state = {
        ...this.state,
        projectiles: this.state.projectiles
          .filter(proj => this.state.ships.every(ship => !collision(ship, proj))),
        ships: this.state.ships
          .map((ship, i) => ({
            ...ship,
            health: ship.health - shipDmg[i],
          }))
          .filter(ship => ship.health > 0),
      };
    }
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
