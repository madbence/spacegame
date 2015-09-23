import test from 'ava';
import game from '../src/common/game';

test('game', t => {
  const initial = {
    ships: [{
      pos: { x: 0, y: 0 },
      vel: { x: 0, y: 0 },
      acc: { x: 1, y: 2 },
    }],
  };
  let next = game(initial, {
    type: 'TICK',
  });

  t.same(next.ships[0].pos, { x: 1, y: 2 });
  t.same(next.ships[0].vel, { x: 1, y: 2 });

  next = game(next, {
    type: 'TICK',
  });

  t.same(next.ships[0].pos, { x: 3, y: 6 });
  t.same(next.ships[0].vel, { x: 2, y: 4 });
  t.end();
});
