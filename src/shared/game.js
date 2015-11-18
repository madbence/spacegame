/* @flow */

import {
  advanceShip,
  advanceProjectile,
} from './physics';

import {
  combine,
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

import type {
  Ship,
  Projectile,
  State,
  Action,
} from '../../types';

import * as gameActions from './actions';

const actionList = Object.keys(gameActions).map(name => gameActions[name]);

function updateAt<T>(xs: Array<T>, index: number, modification: any): Array<T> {
  return [...xs.slice(0, index), { ...xs[index], ...modification }, ...xs.slice(index + 1)];
}

function setThrust(ships: Array<Ship> = [], shipIndex: number, thrusterIndex: number, strength: number): Array<Ship> {
  return updateAt(
    ships,
    shipIndex, {
      thrusters: updateAt(
        ships[shipIndex].thrusters,
        thrusterIndex, {
          strength,
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
    ttl: 200,
    owner: ship.id
  };
}

function makeShip(state: State, client: string, name: string): Ship {
  return {
    id: state.uid,
    client,
    name,
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
  };
}

function addProjectile(projectiles: Array<Projectile> = [], ship: Ship): Array<Projectile> {
  return projectiles.concat([makeProjectile(ship)]);
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
    let ship, index;
    switch (action.type) {
      case SET_THRUST:
        ship = state.ships.filter(s => s.id === action.payload.shipId)[0];
        if (!ship) {
          return state;
        }
        index = state.ships.indexOf(ship);
        return {
          ...state,
          ships: setThrust(state.ships, index, action.payload.thrusterIndex, action.payload.strength),
        };
      case FIRE_WEAPON:
        ship = state.ships.filter(s => s.id === action.payload.shipId)[0];
        if (!ship) {
          return state;
        }
        index = state.ships.indexOf(ship);
        return {
          ...state,
          projectiles: addProjectile(state.projectiles, state.ships[index]),
        };
      case JOIN_PLAYER:
        return {
          ...state,
          ships: state.ships.concat([makeShip(state, action.payload.client, action.payload.name)]),
          uid: state.uid + 1,
        };
      default:
        return state;
    }
  }
);

export default (state: State, action: Action) => {
  if (action.type === SYNC_GAME) {
    return action.payload;
  }
  if (action.type !== 'NOOP' && actionList.indexOf(action.type) === -1) {
    return state || null;
  }
  if (state) {
    return process(state, action);
  }
  return null;
};
