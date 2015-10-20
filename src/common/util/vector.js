/* @flow */

export function add(a: Vector, b: Vector): Vector {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

export function sub(a: Vector, b: Vector): Vector {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

export function unit(orientation: number): Vector {
  return {
    x: -Math.sin(orientation),
    y: Math.cos(orientation),
  };
}

export function cross(a: Vector, b: Vector): number {
  return a.x * b.y - a.y * b.x;
}

export function rotate(a: Vector, f: number): Vector {
  return {
    x: Math.cos(f) * a.x - Math.sin(f) * a.y,
    y: Math.sin(f) * a.x + Math.cos(f) * a.y,
  };
}

export function scale(a: Vector, f: number): Vector {
  return {
    x: a.x * f,
    y: a.y * f,
  }
}
