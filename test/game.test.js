import test from 'ava';
import game from '../src/common/game';

test('stationary ship stays stationary', t => {
  const initial = {
    time: 0,
    step: 1,
    ships: [{
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      orientation: 0,
      rotation: 0,
      thrusters: [],
    }],
    projectiles: [],
  };
  let next = game(initial, {
    type: 'TICK',
    payload: {
      time: 1,
    },
  }).ships;

  t.same(next[0].position, { x: 0, y: 0 });
  t.same(next[0].velocity, { x: 0, y: 0 });
  t.same(next[0].rotation, 0);
  t.same(next[0].orientation, 0);

  t.end();
});

test('moving ship does not lose energy', t => {
  const initial = {
    time: 0,
    step: 1,
    ships: [{
      position: { x: 0, y: 0 },
      velocity: { x: 1, y: 1 },
      orientation: 0,
      rotation: 1,
      thrusters: [],
    }],
    projectiles: [],
  };
  let next = game(initial, {
    type: 'TICK',
    payload: {
      time: 1,
    },
  }).ships;

  t.same(next[0].position, { x: 1, y: 1 });
  t.same(next[0].velocity, { x: 1, y: 1 });
  t.same(next[0].rotation, 1);
  t.same(next[0].orientation, 1);

  t.end();
});
