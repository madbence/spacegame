import {
  advanceShip,
  advanceProjectile,
} from './physics';

import {
  createReducer,
  combine,
  combineProps,
} from './util/helpers';

function updateAt(xs: Array<T>, index: number, modification: any): Array<T> {
  return [...xs.slice(0, index), { ...xs[index], ...modification }, ...xs.slice(index + 1)];
}

function setThrust(ships: Array<Ship> = [], action: Action): Array<Ship> {
  return updateAt(
    ships,
    action.payload.shipIndex, {
      thrusters: updateAt(
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
