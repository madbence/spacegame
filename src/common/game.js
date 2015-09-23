/* @flow */

type State = {
  ships: Array<Ship>,
}

type Ship = {
  pos: Vector,
  vel: Vector,
  acc: Vector,
}

type Vector = { x: number, y: number }
type Position = Vector

type Action = { type: 'TICK' }

function advanceShip(ship: Ship): Ship {
  const vel = {
    x: ship.vel.x + ship.acc.x,
    y: ship.vel.y + ship.acc.y,
  };
  const pos = {
    x: ship.pos.x + vel.x,
    y: ship.pos.y + vel.y,
  };
  return {
    ...ship,
    pos: pos,
    vel: vel,
  };
}

export default function reduce(state: State, action: Action) {
  switch (action.type) {
    case 'TICK':
    return {
      ...state,
      ships: state.ships.map(advanceShip),
    };
  }
}
