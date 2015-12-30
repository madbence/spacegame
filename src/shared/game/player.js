/* @flow */

import {
  updateAt,
} from '../util/helpers';

import type {
  Player,
} from '../../../types';

function create(client: string, name: string): Player {
  return {
    client,
    name,
    state: 'connected',
    respawn: 5000,
  };
}

export function add(players: Array<Player>, client: string, name: string): Array<Player> {
  const old = players.filter(player => player.name === name)[0];
  if (old) {
    return updateAt(players, players.indexOf(old), {
      client,
      state: 'connected',
    });
  }
  return players.concat([create(client, name)]);
}

export function remove(players: Array<Player>, client: string): Array<Player> {
  const old = players.filter(player => player.client === client)[0];
  if (old) {
    return updateAt(players, players.indexOf(old), {
      state: 'disconnected',
    });
  }
  return players;
}
