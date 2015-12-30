/* @flow */

export type Vector = {
  x: number,
  y: number,
}

export type State = {
  ships: Array<Ship>,
  projectiles: Array<Projectile>,
  explosions: Array<Explosion>,
  players: Array<Player>,
  uid: number,
  time: number,
  step: number,
}

export type Player = {
  name: string,
  client: string,
  state: string,
}

export type Ship = {
  id: number,
  client: string,
  name: string,
  position: Vector,
  velocity: Vector,
  orientation: Rotation,
  rotation: Rotation,
  thrusters: Array<Thruster>,
  hull: number,
  shield: number,
}

export type Thruster = {
  thrust: number,
  strength: number,
  position: Vector,
  orientation: Rotation,
}

export type Projectile = {
  position: Vector,
  velocity: Vector,
  orientation: Rotation,
  owner: number,
  ttl: number,
}

export type Explosion = {
  position: Vector,
  time: number,
}

type Position = Vector
type Rotation = number

export type Action = ThrusterAction |
                     FireAction

export type ThrusterAction = {
  type: 'SET_THRUSTER_STRENGTH',
  payload: {
    shipId: number,
    thrusterIndex: number,
    strength: number,
    time: number
  }
}

export type FireAction = {
  type: 'FIRE',
  payload: {
    shipId: number,
    time: number,
  },
}
