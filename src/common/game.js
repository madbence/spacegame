/* @flow */

type State = {
  ships: Array<Ship>,
  projectiles: Array<Projectile>,
}

type Ship = {
  position: Vector,
  velocity: Vector,
  orientation: Rotation,
  rotation: Rotation,
  thrusters: Array<Thruster>
}

type Thruster = {
  strength: number,
  position: Vector,
  orientation: Rotation,
}

type Projectile = {
  position: Vector,
  velocity: Vector,
  orientation: Rotation,
}

type Vector = { x: number, y: number }
type Position = Vector
type Rotation = number

type Action =
  { type: 'TICK' } |
  { type: 'SET_THRUSTER_STRENGTH', payload: {
    shipIndex: number, thrusterIndex: number, strength: number } }

function vadd(a: Vector, b: Vector): Vector {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

function vsub(a: Vector, b: Vector): Vector {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

function mkForce(orientation: Rotation, strength: number) {
  return {
    x: -Math.sin(orientation) * strength,
    y: Math.cos(orientation) * strength,
  };
}

function vcross(a: Vector, b: Vector): number {
  return a.x * b.y - a.y * b.x;
}

function rot(a: Vector, f: number): Vector {
  return {
    x: -Math.sin(f) * a.y,
    y: Math.cos(f) * a.y,
  };
}

function advanceShip(ship: Ship): Ship {
  const force = ship.thrusters.reduce((force, thruster) => {
    return vadd(force, mkForce(thruster.orientation, thruster.strength));
  }, { x: 0, y: 0 });
  const torqe = ship.thrusters.reduce((momentum, thruster) => {
    return momentum + vcross(thruster.position, mkForce(thruster.orientation, thruster.strength));
  }, 0);
  const rotation = ship.rotation + torqe;
  const orientation = ship.orientation + rotation;
  const velocity = vadd(ship.velocity, rot(force, orientation));
  const position = vadd(ship.position, velocity);
  return {
    ...ship,
    velocity,
    position,
    rotation,
    orientation,
  };
}

function advanceProjectile(projectile: Projectile): Projectile {
  const position = vadd(projectile.position, projectile.velocity);
  return {
    ...projectile,
    position,
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

function updateThruster(thrusters: Array<Thruster>, index: number, modification: any): Array<Thruster> {
  return thrusters.slice(0, index).concat(
    [{ ...thrusters[index], ...modification }],
    thrusters.slice(index + 1)
  );
};

export default function reduce(state: State, action: Action): State {
  state = state || {
    ships: [],
    projectiles: [],
  };
  switch (action.type) {
    case 'TICK':
    return {
      ships: state.ships.map(advanceShip),
      projectiles: state.projectiles.map(advanceProjectile),
    };
    case 'SET_THRUSTER_STRENGTH':
    return {
      projectiles: state.projectiles,
      ships: updateShip(
        state.ships,
        action.payload.shipIndex, {
          thrusters: updateThruster(
            state.ships[action.payload.shipIndex].thrusters,
            action.payload.thrusterIndex, {
              strength: action.payload.strength,
            }
          )
        }
      ),
    };
    case 'SYNC_STATE':
    return action.payload;
  }
  return state;
}
