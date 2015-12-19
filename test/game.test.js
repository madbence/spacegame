import test from 'ava';
import { advanceShip } from '../src/shared/game/physics';

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

    next = advanceShip(next, 1);
    t.same(next.position, { x: 2 * x, y: 2 * y });
    t.same(next.velocity, { x, y });
  });

  t.end();
});
