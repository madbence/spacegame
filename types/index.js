type Vector = {
  x: number,
  y: number,
}

type State = {
  ships: Array<Ship>,
  projectiles: Array<Projectile>,
}

type Ship = {
  position: Vector,
  velocity: Vector,
  orientation: Rotation,
  rotation: Rotation,
  thrusters: Array<Thruster>
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

type Action =
  { type: 'TICK' } |
  { type: 'SET_THRUSTER_STRENGTH', payload: {
    shipIndex: number, thrusterIndex: number, strength: number } }

