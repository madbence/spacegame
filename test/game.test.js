import test from 'ava';
import game from '../src/common/game';

test('game', t => {
  const initial = [{
    pos: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
    rot: 0,
    avel: 0,
  }];
  let next = game(initial, {
    type: 'TICK',
  });

  t.same(next[0].pos, { x: 0, y: 0 });
  t.same(next[0].vel, { x: 0, y: 0 });

  t.end();
});
