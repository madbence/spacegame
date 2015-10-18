/* @flow */

import {
  add,
  sub,
  rotate,
  scale,
  unit,
  cross,
} from './util/vector';

/**
 * Simulates ship movement
 */
export function advanceShip(ship: Ship): Ship {

  // calculate net force
  const force = ship.thrusters.reduce((force, thruster) => {
    return add(force, scale(unit(thruster.orientation), thruster.strength));
  }, { x: 0, y: 0 });

  // calculate net torque
  const torque = ship.thrusters.reduce((torque, thruster) => {
    return torque + cross(thruster.position, scale(unit(thruster.orientation), thruster.strength));
  }, 0);


  const rotation = ship.rotation + torque;
  const orientation = ship.orientation + rotation;
  const velocity = add(ship.velocity, rotate(force, orientation));
  const position = add(ship.position, velocity);

  // return modified ship
  return {
    ...ship,
    velocity,
    position,
    rotation,
    orientation,
  };
}

/**
 * Simulates projectile movement
 */
export function advanceProjectile(projectile: Projectile): Projectile {
  const position = add(projectile.position, projectile.velocity);

  // return modified projectile
  return {
    ...projectile,
    position,
  };
}
