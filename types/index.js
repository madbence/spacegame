export type Vector = {
  x: number,
  y: number,
}

export type State = {
  ships: Array<Ship>,
  projectiles: Array<Projectile>,
  uid: number,
}

export type Ship = {
  id: number,
  client: string,
  position: Vector,
  velocity: Vector,
  orientation: Rotation,
  rotation: Rotation,
  thrusters: Array<Thruster>,
  hull: number,
}

export type Thruster = {
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

type Position = Vector
type Rotation = number

export type Action = TickAction |
              ThrusterAction |
              FireAction

export type TickAction = {
  type: 'TICK'
}

export type ThrusterAction = {
  type: 'SET_THRUSTER_STRENGTH',
  payload: {
    thrusterIndex: number,
    strength: number
  }
}

export type FireAction = {
  type: 'FIRE',
  payload: {},
}
