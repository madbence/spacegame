/* @flow */

import {
  add,
  sub,
  rotate,
  multiply,
  unit,
  cross,
} from './util/vector';

function advanceShip(ship: Ship): Ship {
  const force = ship.thrusters.reduce((force, thruster) => {
    return add(force, multiply(unit(thruster.orientation), thruster.strength));
  }, { x: 0, y: 0 });
  const torqe = ship.thrusters.reduce((momentum, thruster) => {
    return momentum + cross(thruster.position, multiply(unit(thruster.orientation), thruster.strength));
  }, 0);
  const rotation = ship.rotation + torqe;
  const orientation = ship.orientation + rotation;
  const velocity = add(ship.velocity, rotate(force, orientation));
  const position = add(ship.position, velocity);
  return {
    ...ship,
    velocity,
    position,
    rotation,
    orientation,
  };
}

function advanceProjectile(projectile: Projectile): Projectile {
  const position = add(projectile.position, projectile.velocity);
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

function setThrust(ships: Array<Ship> = [], action: Action): Array<Ship> {
  return updateShip(
    ships,
    action.payload.shipIndex, {
      thrusters: updateThruster(
        ships[action.payload.shipIndex].thrusters,
        action.payload.thrusterIndex, {
          strength: action.payload.strength,
        }
      )
    }
  );
}

function advanceShips(ships: Array<Ship> = [], action: Action): Array<Ship> {
  return ships.map(advanceShip);
}

function advanceProjectiles(projectiles: Array<Projectile> = [], action: Action): Array<Projectile> {
  return projectiles.map(advanceProjectile);
}

const handleShips = createReducer([], {
  'TICK': advanceShips,
  'SET_THRUSTER_STRENGTH': setThrust,
});

const handleProjectiles = createReducer([], {
  'TICK': advanceProjectiles,
});

function fireWeapon(state: State, action: FireAction): State {
  return {
    ships: state.ships,
    projectiles: state.projectiles.concat([{
      position: state.ships[action.payload.shipIndex].position,
      velocity: add(state.ships[action.payload.shipIndex].velocity, unit(state.ships[action.payload.shipIndex].orientation)),
      orientation: state.ships[action.payload.shipIndex].orientation,
    }]),
  };
}

function handleWeapons(state, action) {
  if (action.type === 'FIRE') {
    return fireWeapon(state, action);
  }
  return state;
}

function combine(...reducers) {
  return function (state: State, action: Action): State {
    return reducers.reduce((state, reducer) => reducer(state, action), state);
  };
}

function combineProps(reducers) {
  return function (state, action) {
    return Object.keys(reducers).reduce((state, prop) => ({...state, [prop]: reducers[prop](state[prop], action)}), state);
  };
}

function createReducer(initial, reducers) {
  return function (state = initial, action) {
    if (reducers[action.type]) {
      return reducers[action.type](state, action);
    }
    return state;
  }
}

export default combine(

  // default empty state
  function (state) { return state || { ships: [], projectiles: [] }; },

  // handle weapon firing
  handleWeapons,

  // advance
  combineProps({
    ships: handleShips,
    projectiles: handleProjectiles,
  })
);
