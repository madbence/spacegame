import test from 'tape';
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

  t.deepEquals(next.position, nv);
  t.deepEquals(next.velocity, nv);
  t.deepEquals(next.rotation, 0);
  t.deepEquals(next.orientation, 0);

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
    t.deepEquals(next.position, { x, y });
    t.deepEquals(next.velocity, { x, y });

    next = advanceShip(next, 2);
    t.deepEquals(next.position, { x: 3 * x, y: 3 * y });
    t.deepEquals(next.velocity, { x, y });
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
    t.equals(next.rotation, r);
    t.equals(next.orientation, r);

    next = advanceShip(next, 2);
    t.equals(next.rotation, r);
    t.equals(next.orientation, r * 3);
  });

  t.end();
});
