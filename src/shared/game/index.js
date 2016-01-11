/* @flow */

import {
  advanceShip,
  advanceProjectile,
  advanceExplostion,
} from './physics';

import {
  add as addPlayer,
} from './player';

import {
  combine,
  updateAt,
} from '../util/helpers';

import {
  unit,
  add,
  scale,
  distance,
} from '../util/vector';

import {
  FIRE_WEAPON,
  SET_THRUST,
  SYNC_GAME,
  JOIN_PLAYER,
  NOOP,
} from '../actions';

import type {
  Ship,
  Projectile,
  State,
  Action,
  Explosion,
} from '../../../types';

import * as gameActions from '../actions';

const actionList = Object.keys(gameActions).map(name => gameActions[name]);

function setThrust(ships: Array<Ship> = [], shipIndex: number, thrusterIndex: number, strength: number): Array<Ship> {
  return updateAt(
    ships,
    shipIndex, {
      thrusters: updateAt(
        ships[shipIndex].thrusters,
        thrusterIndex, {
          strength,
        }
      ),
    },
  );
}

function makeProjectile(ship: Ship): Projectile {
  return {
    position: ship.position,
    velocity: add(ship.velocity, scale(unit(ship.orientation), 200)),
    orientation: ship.orientation,
    ttl: 2,
    owner: ship.owner,
  };
}

function makeShip(state: State, owner: number, name: string): Ship {
  const count = state.ships.length;
  return {
    id: state.uid,
    owner,
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
    shield: 5,
  };
}

function join(state: State, client: string, name: string): State {
  const old = state.ships.filter(ship => ship.name === name)[0];
  if (old) {
    return addPlayer(state, client, name);
  }
  state = addPlayer(state, client, name);
  return {
    ...state,
    ships: state.ships.concat([makeShip(state, state.uid - 1, name)]),
    uid: state.uid + 1,
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
    const collisions = state.ships.filter(ship => ship.owner !== projectile.owner && distance(projectile.position, ship.position) < 10 && ship.shield < 1);
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
  const shipCache = {};
  const scoreCache = {};
  const ships = state.ships.reduce((ships, ship) => {
    const sources = [];
    const damagedShip = damages
      // only relevant damages are checked
      .filter(damage => damage.target === ship.id)
      // every damage deals constant damage to the hull
      .reduce((ship, damage) => {
        sources.push(damage.source);
        return {
          ...ship,
          hull: ship.hull - 20,
        };
      }, ship);

    // remove ship if hull broken
    if (damagedShip.hull < 1) {
      sources.reduce((cache, source) => {
        cache[source] = (cache[source] || 0) + 1;
        return cache;
      }, scoreCache);
      events.push({
        type: 'explosion',
        position: ship.position,
      });
      return ships;
    }
    shipCache[ship.owner] = true;
    return [...ships, damagedShip];
  }, []);

  const players = state.players

    // add scores
    .map(player => {
      if (scoreCache[player.id]) {
        return {
          ...player,
          score: player.score + scoreCache[player.id],
        };
      }
      return player;
    })

    // trigger respawn timers
    .map(player => {
      if (shipCache[player.id]) {
        return player;
      } else if (player.respawn !== null) {
        return player;
      }
      return {
        ...player,
        respawn: 5000,
      };
    });

  return {
    ...state,
    players,
    projectiles,
    ships,
    explosions: state.explosions.concat(events.map(event => ({
      ttl: 5,
      position: event.position,
    }))),
  };
}

function oldEntities(entity: Projectile | Explosion): boolean {
  return entity.ttl > 0;
}

function destoryedShips(ship) {
  return ship.hull > 0;
}

function respawnShips(state: State): State {
  const newShips = [];
  return {
    ...state,
    players: state.players.map(player => {
      if (player.respawn == null) {
        return player;
      } else if (player.respawn > 0) {
        return {
          ...player,
          respawn: player.respawn - state.step,
        };
      }
      newShips.push(makeShip(state, player.id, player.name));
      return {
        ...player,
        respawn: null,
      };
    }),
    ships: state.ships.concat(newShips),
    uid: state.uid + newShips.length,
  };
}

function step(state: State): State {

  state = {
    ...state,
    time: state.time + state.step,
    ships: state.ships.filter(destoryedShips).map(ship => advanceShip(ship, state.step / 1000)),
    projectiles: state.projectiles.filter(oldEntities).map(projectile => advanceProjectile(projectile, state.step / 1000)),
    explosions: state.explosions.filter(oldEntities).map(explosion => advanceExplostion(explosion, state.step / 1000)),
  };

  return respawnShips(handleCollisions(state));
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
        return join(state, action.payload.client, action.payload.name);
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
