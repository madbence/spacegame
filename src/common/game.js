import {
  advanceShip,
  advanceProjectile,
} from './physics';

import {
  createReducer,
  combine,
  combineProps,
} from './util/helpers';

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


const handleShips = createReducer([], {
  'TICK': advanceShips,
  'SET_THRUSTER_STRENGTH': setThrust,
});

const handleProjectiles = createReducer([], {
  'TICK': advanceProjectiles,
});

const handleWeapons = createReducer(undefined, {
  'FIRE': fireWeapon,
});

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
