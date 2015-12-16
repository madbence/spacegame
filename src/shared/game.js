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
  NOOP,
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
    velocity: add(ship.velocity, scale(unit(ship.orientation), 200)),
    orientation: ship.orientation,
    ttl: 2,
    owner: ship.id
  };
}

function makeShip(state: State, client: string, name: string): Ship {
  const count = state.ships.length;
  return {
    id: state.uid,
    client,
    name,
    position: {
      x: count % 2 * 500 - 250,
      y: Math.floor(count / 2) * 500 - 250,
    },
    velocity: {x: 0, y: 0},
    orientation: 0,
    rotation: 0,
    thrusters: [{
      position: { x: 0, y: -10 },
      orientation: 0,
      thrust: 40,
      strength: 0,
    }, {
      position: { x: 5, y: 8 },
      orientation: Math.PI / 2,
      thrust: 0.1,
      strength: 0,
    }, {
      position: { x: -5, y: 8 },
      orientation: -Math.PI / 2,
      thrust: 0.1,
      strength: 0,
    }],
    hull: 100,
  };
}

function addProjectile(projectiles: Array<Projectile> = [], ship: Ship): Array<Projectile> {
  return projectiles.concat([makeProjectile(ship)]);
}

function handleCollisions(state) {
  const events = [];

  // from projectiles, get the remaining projectiles and dealt damages
  const [projectiles, damages] = state.projectiles.reduce(([projectiles, damages], projectile) => {
    // collisions with ships (avoiding self-collisions)
    const collisions = state.ships.filter(ship => ship.id !== projectile.owner && distance(projectile.position, ship.position) < 10);
    // if there are no collisions, the projectile remains on the field
    if (collisions.length < 1) {
      return [projectiles.concat([projectile]), damages];
    }
    events.push({
      type: 'collision',
      time: state.time,
      position: projectile.position,
    });
    // if there are collisions, add them to the damages
    return [projectiles, damages.concat(collisions.map(ship => ({
      target: ship.id,
      source: projectile.owner,
    })))];
  }, [[], []]);

  // remaining ships after applying dealt damages
  const ships = state.ships.reduce((ships, ship) => {
    const damagedShip = damages
      // only relevant damages are checked
      .filter(damage => damage.target === ship.id)
      // every damage deals constant damage to the hull
      .reduce(ship => ({
        ...ship,
        hull: ship.hull - 20,
      }), ship);
    // remove ship if hull broken
    if (damagedShip.hull < 1) {
      events.push({
        type: 'explosion',
        time: state.time,
        position: ship.position,
      });
      return ships;
    }
    return [...ships, damagedShip];
  }, []);

  return {
    ...state,
    projectiles,
    ships,
    explosions: state.explosions.concat(events.map(event => ({
      time: event.time,
      position: event.position,
    }))),
  };
}

function oldProjectiles(projectile) {
  return projectile.ttl > 0;
}

function destoryedShips(ship) {
  return ship.hull > 0;
}

function oldExplosions(time) {
  return function (explosion) {
    return explosion.time + 5000 > time;
  };
}

function step(state: State): State {

  state = {
    ...state,
    time: state.time + state.step,
    ships: state.ships.filter(destoryedShips).map(ship => advanceShip(ship, state.step / 1000)),
    projectiles: state.projectiles.filter(oldProjectiles).map(projectile => advanceProjectile(projectile, state.step / 1000)),
    explosions: state.explosions.filter(oldExplosions(state.time)),
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
  if (action.type !== NOOP && actionList.indexOf(action.type) === -1) {
    return state || null;
  }
  if (state) {
    return process(state, action);
  }
  return null;
};
