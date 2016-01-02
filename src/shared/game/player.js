/* @flow */

import {
  updateAt,
} from '../util/helpers';

import type {
  Player,
  State,
} from '../../../types';

function create(id: number, client: string, name: string): Player {
  return {
    id,
    client,
    name,
    state: 'connected',
    respawn: null,
  };
}

export function add(state: State, client: string, name: string): State {
  const old = state.players.filter(player => player.name === name)[0];
  if (old) {
    return {
      ...state,
      players: updateAt(state.players, state.players.indexOf(old), {
        client,
        state: 'connected',
      }),
    };
  }
  return {
    ...state,
    players: state.players.concat([create(state.uid, client, name)]),
    uid: state.uid + 1,
  };
}
