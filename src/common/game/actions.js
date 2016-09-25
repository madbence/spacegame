// @flow

import type {Vec} from './'

export const SHOOT = 'game:shoot';
export const THRUST = 'game:thrust';
export const ADD_PLAYER = 'game:add-player';
export const ADD_SHIP = 'game:add-ship';

export type ShootAction = {
  type: typeof SHOOT,
  payload: {
    id: number,
  },
};
export type ThrustAction = {
  type: typeof THRUST,
  payload: {
    id: number, index: number, strength: number,
  },
};
export type AddShipAction = {
  type: typeof ADD_SHIP,
  payload: {
    type: number, owner: number, pos: Vec, ori: number,
  },
};
export type AddPlayerAction = {
  type: typeof ADD_PLAYER,
  payload: {
    name: string,
  },
};

export type Action = ShootAction | ThrustAction | AddShipAction | AddPlayerAction;

export function thrust(id: number, index: number, strength: number): ThrustAction {
  return {
    type: THRUST,
    payload: {
      id, index, strength,
    },
  };
}

export function shoot(id: number): ShootAction {
  return {
    type: SHOOT,
    payload: {
      id,
    },
  };
}

export function addShip(type: number, owner: number, pos: Vec, ori: number): AddShipAction {
  return {
    type: ADD_SHIP,
    payload: {
      type, owner, pos, ori,
    },
  };
}

export function addPlayer(name: string): AddPlayerAction {
  return {
    type: ADD_PLAYER,
    payload: {
      name,
    },
  };
}
