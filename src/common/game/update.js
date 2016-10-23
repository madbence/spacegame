// @flow

import type {Ship, Projectile} from './';

import {sadd, scale, length, cross, rotate, unit} from './vector';
import ships from './ships';

export function updateShip(ship: Ship, dt: number): Ship {
  let vel = sadd(ship.vel, ship.acc, dt);
  if (length(vel) > 100) {
    vel = scale(vel, 100 / length(vel));
  }
  let rot = ship.rot + ship.tor * dt;
  if (Math.abs(rot) > 1) {
    rot = 1 / rot;
  }
  const ts = ships[ship.type].thrusters;
  const acc = ship.thrusters.reduce((f, s, i) => sadd(f, unit(ts[i].ori), s * ts[i].thrust), [0, 0]);
  const tor = ship.thrusters.reduce((t, s, i) => t + cross(ts[i].pos, scale(unit(ts[i].ori), s * ts[i].thrust)), 0);

  return {
    ...ship,
    pos: sadd(ship.pos, ship.vel, dt),
    vel,
    acc: rotate(acc, ship.ori),
    ori: ship.ori + ship.rot * dt,
    rot,
    tor,
  };
}

export function updateProjectile(projectile: Projectile, dt: number): Projectile {
  return {
    ...projectile,
    pos: sadd(projectile.pos, projectile.vel, dt),
  };
}
