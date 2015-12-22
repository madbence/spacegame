import test from 'ava';
import { advanceShip, advanceProjectile } from '../src/shared/game/physics';

const nv = { x: 0, y: 0 };

test('stationary ship stays stationary', t => {
  const initial = {
    position: nv,
    velocity: nv,
    rotation: 0,
    orientation: 0,
    thrusters: [],
  };

  let next = advanceShip(initial, 1);

  t.same(next.position, nv);
  t.same(next.velocity, nv);
  t.same(next.rotation, 0);
  t.same(next.orientation, 0);

  t.end();
});

test(`ship moves to the right direction`, t => {
  [
    [0, 1],
    [1, 0],
    [1, 1],
  ].forEach(([x, y]) => {
    const initial = {
      position: nv,
      velocity: { x, y },
      rotation: 0,
      orientation: 0,
      thrusters: [],
    };

    let next = advanceShip(initial, 1);
    t.same(next.position, { x, y });
    t.same(next.velocity, { x, y });

    next = advanceShip(next, 2);
    t.same(next.position, { x: 3 * x, y: 3 * y });
    t.same(next.velocity, { x, y });
  });

  t.end();
});

test(`ship rotates to the right direction`, t => {
  [
    1,
    -1,
  ].forEach(r => {
    const initial = {
      position: nv,
      velocity: nv,
      rotation: r,
      orientation: 0,
      thrusters: [],
    };

    let next = advanceShip(initial, 1);
    t.is(next.rotation, r);
    t.is(next.orientation, r);

    next = advanceShip(next, 2);
    t.is(next.rotation, r);
    t.is(next.orientation, r * 3);
  });

  t.end();
});

test('projectile moves to the right direction', t => {
  [
    [0, 0],
    [1, 0],
  ].forEach(([x, y]) => {
    const p = {
      position: nv,
      velocity: { x, y },
    };

    let next = advanceProjectile(p, 1);
    t.same(next.position, { x, y });
    t.same(next.velocity, { x, y });

    next = advanceProjectile(next, 9);
    t.same(next.position, { x: x * 10, y: y * 10 });
    t.same(next.velocity, { x, y });
  });

  t.end();
});
