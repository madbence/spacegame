// @flow

import {updateShip, updateProjectile} from './update';
import {collision} from './utils';

export default function simulate(state: State, t: number): State {
  while (state.t + state.dt < t) {
    state = {
      ...state,
      t: state.t + state.dt,
      ships: state.ships.map(ship => updateShip(ship, state.dt)),
      projectiles: state.projectiles
        .filter(projectile => projectile.t + 5 > state.t)
        .map(projectile => updateProjectile(projectile, state.dt)),
    };

    const shipDmg = state.ships.map(ship => {
      const damages = {};
      for (const p of state.projectiles) {
        if (collision(ship, p)) {
          damages[p.owner] = damages[p.owner] || 0;
          damages[p.owner] += .1;
        }
      }
      return damages;
    });

    const damagedShips = state.ships
      .map((ship, i) => ({
        ...ship,
        health: ship.health - Object.keys(shipDmg[i]).reduce((sum, key) => sum + shipDmg[i][key], 0),
      }));

    const points = damagedShips.reduce((points, ship, i) => {
      if (ship.health > 0) return points;
      return Object.keys(shipDmg[i]).reduce((points, key) => {
        points[key] = points[key] || 0;
        points[key]++;
        return points;
      }, points);
    }, {});

    state = {
      ...state,
      players: state.players.map(player => ({
        ...player,
        score: player.score + (points[player.id] || 0),
      })),
      projectiles: state.projectiles
        .filter(proj => state.ships.every(ship => !collision(ship, proj))),
      ships: damagedShips
        .filter(ship => ship.health > 0),
    };
  }

  return state;
}
