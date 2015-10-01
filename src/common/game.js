/* @flow */

type Ship = {

  // current position
  pos: Vector,

  // current velocity
  vel: Vector,

  // current rotation
  rot: Rotation,

  // current rotational velocity
  avel: Rotation,

  // are thrusters on?
  thrust: bool,

  // rotational thrusters direction
  rotThrust: number
}

type Vector = { x: number, y: number }
type Position = Vector
type Rotation = number

type Action =
  { type: 'TICK' } |
  { type: 'ACCELERATE', index: number, state: bool } |
  { type: 'ROTATE', index: number, dir: number }

function advanceShip(ship: Ship): Ship {

  // calculate new roational velocity
  let avel = ship.avel + ship.rotThrust;

  // calculate new velocity
  let vel = ship.vel;
  if (ship.thrust) {

    // with active thrusters, velocity should increase in the direction of
    // the current rotation
    vel = {
      x: ship.vel.x + -Math.sin(ship.rot) * 0.01,
      y: ship.vel.y +  Math.cos(ship.rot) * 0.01,
    };
  }

  // calculate new rotation
  let rot = ship.rot + avel;

  // calculate new position
  let pos = {
    x: ship.pos.x + vel.x,
    y: ship.pos.y + vel.y,
  };

  return {
    ...ship,
    pos,
    vel,
    rot,
    avel,
  };
}

/**
 * Update ship with the specific index with the given modifications
 */
function updateShip(ships: Array<Ship>, index: number, modification: any): Array<Ship> {
  return ships.slice(0, index - 1).concat(
    [{ ...ships[index], ...modification }],
    ships.slice(index + 1)
  );
};

export default function reduce(ships: Array<Ship> = [], action: Action): Array<Ship> {
  switch (action.type) {
    case 'TICK':
    return ships.map(advanceShip);
    case 'ACCELERATE':
    return updateShip(ships, action.index, { thrust: action.state });
    case 'ROTATE':
    return updateShip(ships, action.index, { rotThrust: action.dir });
  }
  return ships;
}
