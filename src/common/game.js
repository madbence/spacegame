/* @flow */

type Ship = {
  pos: Vector,
  vel: Vector,
  rot: Rotation,
  avel: Rotation,
  thrust: bool,
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
  let avel = ship.avel + ship.rotThrust;
  let vel = ship.vel;
  if (ship.thrust) {
    vel = {
      x: ship.vel.x + -Math.sin(ship.rot) * 0.01,
      y: ship.vel.y +  Math.cos(ship.rot) * 0.01,
    };
  }
  let rot = ship.rot + avel;
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

export default function reduce(ships: Array<Ship> = [], action: Action): Array<Ship> {
  switch (action.type) {
    case 'TICK':
    return ships.map(advanceShip);
    case 'ACCELERATE':
    return [...ships.slice(0, action.index - 1), { ...ships[action.index], thrust: action.state }, ...ships.slice(action.index + 1)];
    case 'ROTATE':
    return [...ships.slice(0, action.index - 1), { ...ships[action.index], rotThrust: action.dir }, ...ships.slice(action.index + 1)];
  }
  return ships;
}
