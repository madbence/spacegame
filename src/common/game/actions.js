// @flow

import type {Vec, State} from './'

export const SHOOT = 'game:shoot';
export const THRUST = 'game:thrust';
export const ADD_PLAYER = 'game:add-player';
export const ADD_SHIP = 'game:add-ship';
export const SYNC = 'game:sync';

export type ShootAction = {
  type: typeof SHOOT,
  id: number,
  t: number,
};

export type ThrustAction = {
  type: typeof THRUST,
  id: number,
  index: number,
  strength: number,
  t: number,
};

export type AddShipAction = {
  type: typeof ADD_SHIP,
  ship: number,
  owner: number,
  pos: Vec,
  ori: number,
  t: number,
};

export type AddPlayerAction = {
  type: typeof ADD_PLAYER,
  name: string,
  t: number,
};

export type Action = ShootAction | ThrustAction | AddShipAction | AddPlayerAction;
