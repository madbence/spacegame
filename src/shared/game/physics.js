/* @flow */

import {
  add,
  rotate,
  scale,
  unit,
  cross,
} from '../util/vector';

import type {
  Ship,
  Projectile,
} from '../../../types';

/**
 * Simulates ship movement
 */
export function advanceShip(ship: Ship, step: number): Ship {

  // calculate net force
  const force = ship.thrusters.reduce((force, thruster) => {
    return add(force, scale(unit(thruster.orientation), thruster.strength * thruster.thrust));
  }, { x: 0, y: 0 });

  // calculate net torque
  const torque = ship.thrusters.reduce((torque, thruster) => {
    return torque + cross(thruster.position, scale(unit(thruster.orientation), thruster.strength * thruster.thrust));
  }, 0);


  const rotation = ship.rotation + torque * step;
  const orientation = ship.orientation + rotation * step;
  const velocity = add(ship.velocity, rotate(scale(force, step), orientation));
  const position = add(ship.position, scale(velocity, step));

  // return modified ship
  return {
    ...ship,
    velocity,
    position,
    rotation,
    orientation,
    shield: Math.max(0, ship.shield - step),
  };
}

/**
 * Simulates projectile movement
 */
export function advanceProjectile(projectile: Projectile, step: number): Projectile {
  const position = add(projectile.position, scale(projectile.velocity, step));

  // return modified projectile
  return {
    ...projectile,
    position,
    ttl: projectile.ttl - step,
  };
}
