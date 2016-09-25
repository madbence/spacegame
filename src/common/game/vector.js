// @flow

import type {Vec} from './';

export function sadd(a: Vec, b: Vec, n: number): Vec {
  return add(a, scale(b, n));
}

export function scale(a: Vec, n: number): Vec {
  return [a[0] * n, a[1] * n];
}

export function add(a: Vec, b: Vec): Vec {
  return [a[0] + b[0], a[1] + b[1]];
}

export function sub(a: Vec, b: Vec): Vec {
  return [a[0] - b[0], a[1] - b[1]];
}

export function unit(n: number): Vec {
  return [-Math.sin(n), Math.cos(n)];
}

export function cross(a: Vec, b: Vec): number {
  return a[0] * b[1] - a[1] * b[0];
}

export function rotate(a: Vec, n: number): Vec {
  return [Math.cos(n) * a[0] - Math.sin(n) * a[1], Math.sin(n) * a[0] + Math.cos(n) * a[1]];
}

export function length(a: Vec): number {
  return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
}

export function distance(a: Vec, b: Vec): number {
  return length(sub(a, b));
}
