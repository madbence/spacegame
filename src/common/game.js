import {
  advanceShip,
  advanceProjectile,
} from './physics';

import {
  createReducer,
  combine,
  combineProps,
} from './util/helpers';

import {
  unit,
  add,
  scale,
} from './util/vector';

import {
  FIRE_WEAPON,
  SET_THRUST,
  SYNC_GAME,
  JOIN_PLAYER,
} from './actions';

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

function makeProjectile(ship: Ship, time: number): Projectile {
  return {
    position: ship.position,
    velocity: add(ship.velocity, scale(unit(ship.orientation), 5)),
    orientation: ship.orientation,
    time,
  };
}

function makeShip(state: State): Ship {
  return {
    id: state.uid,
    position: {x: 0, y: 0},
    velocity: {x: 0, y: 0},
    orientation: 0,
    rotation: 0,
    thrusters: [{
      position: { x: 0, y: -10 },
      orientation: 0,
      strength: 0,
    }, {
      position: { x: 5, y: 8 },
      orientation: Math.PI / 2,
      strength: 0
    }, {
      position: { x: -5, y: 8 },
      orientation: -Math.PI / 2,
      strength: 0
    }],
    hull: 100,
  }
}

function addProjectile(projectiles: Array<Projectile> = [], ship: Ship, time: number): Array<Projectile> {
  return projectiles.concat([makeProjectile(ship, time)])
}

function step(state) {

  function oldProjectiles(projectile) {
    return projectile.time + 1000 > state.time;
  }

  return {
    ...state,
    time: state.time + state.step,
    ships: state.ships.map(advanceShip),
    projectiles: state.projectiles.filter(oldProjectiles).map(advanceProjectile),
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
      case SET_THRUST:
        return {
          ...state,
          ships: setThrust(state.ships, action),
        };
      case FIRE_WEAPON:
        return {
          ...state,
          projectiles: addProjectile(state.projectiles, state.ships[action.payload.shipIndex], state.time),
        };
      case JOIN_PLAYER:
        return {
          ...state,
          ships: state.ships.concat([makeShip(state)]),
          uid: state.uid + 1,
        };
      default:
        return state;
    }
  }
);

export default (state, action) => {
  if (state) return process(state, action);
  if (action.type === SYNC_GAME) return action.payload;
  return null;
};
