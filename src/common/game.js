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
  distance,
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

function makeProjectile(ship: Ship): Projectile {
  return {
    position: ship.position,
    velocity: add(ship.velocity, scale(unit(ship.orientation), 5)),
    orientation: ship.orientation,
    ttl: 50,
    owner: ship.id
  };
}

function makeShip(state: State, client: string): Ship {
  return {
    id: state.uid,
    client,
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

function addProjectile(projectiles: Array<Projectile> = [], ship: Ship): Array<Projectile> {
  return projectiles.concat([makeProjectile(ship)])
}

function handleCollisions(state) {
  const shipDamage = {};
  return {
    ...state,
    projectiles: state.projectiles.map(p => ({
      ...p,
      ttl: state.ships.filter(s => s.id !== p.owner && distance(p.position, s.position) < 10).map(s => shipDamage[s.id] = 1) > 0 ? 0 : p.ttl,
    })),
    ships: state.ships.map(s => ({
      ...s,
      hull: s.hull - (shipDamage[s.id] || 0) * 20
    })),
  };
}

function oldProjectiles(projectile) {
  return projectile.ttl > 0;
}

function destoryedShips(ship) {
  return ship.hull > 0;
}

function step(state) {

  state = {
    ...state,
    time: state.time + state.step,
    ships: state.ships.filter(destoryedShips).map(advanceShip),
    projectiles: state.projectiles.filter(oldProjectiles).map(advanceProjectile),
  };

  return handleCollisions(state);
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
          projectiles: addProjectile(state.projectiles, state.ships[action.payload.shipIndex]),
        };
      case JOIN_PLAYER:
        return {
          ...state,
          ships: state.ships.concat([makeShip(state, action.payload.client)]),
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
