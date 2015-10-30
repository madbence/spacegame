type Vector = {
  x: number,
  y: number,
}

type State = {
  ships: Array<Ship>,
  projectiles: Array<Projectile>,
  uid: number,
}

type Ship = {
  id: number,
  position: Vector,
  velocity: Vector,
  orientation: Rotation,
  rotation: Rotation,
  thrusters: Array<Thruster>,
  hull: number,
}

type Thruster = {
  strength: number,
  position: Vector,
  orientation: Rotation,
}

type Projectile = {
  position: Vector,
  velocity: Vector,
  orientation: Rotation,
}

type Position = Vector
type Rotation = number

type Action = TickAction |
              ThrusterAction |
              FireAction

type TickAction = {
  type: 'TICK'
}

type ThrusterAction = {
  type: 'SET_THRUSTER_STRENGTH',
  payload: {
    shipIndex: number,
    thrusterIndex: number,
    strength: number
  }
}

type FireAction = {
  type: 'FIRE',
  payload: {
    shipIndex: number
  }
}
