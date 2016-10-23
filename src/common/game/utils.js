// @flow

import type {Vec, Thruster, Ship, Projectile} from './';
import {distance} from './vector';

export function mkThruster(pos: Vec, ori: number, thrust: number): Thruster {
  return {
    pos, ori, thrust,
  };
}

export function mkShip(id: number, type: number, owner: number, pos: Vec, ori: number): Ship {
  return {
    id, type, owner, pos, ori,
    vel: [0, 0], acc: [0, 0],
    rot: 0, tor: 0,
    thrusters: [0, 0, 0, 0],
    health: 1,
  };
}

export function collision(ship: Ship, proj: Projectile): bool {
  return ship.owner != proj.owner && distance(ship.pos, proj.pos) < 10;
}
