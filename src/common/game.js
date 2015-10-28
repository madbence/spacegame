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

function step(state) {
  return {
    ...state,
    time: state.time + state.step,
    ships: state.ships.map(advanceShip),
    projectiles: state.projectiles.map(advanceProjectile),
  };
}

const process = combine(
  (state, action) => {
    while (state.time < action.payload.time) {
      state = step(state);
    }
    return state;
  },

  (state, action) => {
    switch (action.type) {
      case 'SET_THRUSTER_STRENGTH':
        return {
          ...state,
          ships: setThrust(state.ships, action),
        };
      default:
        return state;
    }
  }
);

export default (state, action) => {
  if (state) return process(state, action);
  if (action.type === 'INIT_GAME') return action.payload;
  return null;
};
